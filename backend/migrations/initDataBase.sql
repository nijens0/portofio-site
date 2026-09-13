DROP TABLE IF EXISTS dev_project_cross_ref CASCADE;
DROP TABLE IF EXISTS stack_project_cross_ref CASCADE;
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
DROP TABLE IF EXISTS stack CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

CREATE TABLE admin
(
    id            SERIAL,
    email         TEXT NOT NULL,
    password_hash TEXT NOT NULL,

    CONSTRAINT pk_admin PRIMARY KEY (id),
    CONSTRAINT uq_admin_email UNIQUE (email)
);

CREATE TABLE stack
(
    id         SERIAL,
    technology TEXT NOT NULL,

    CONSTRAINT pk_stack PRIMARY KEY (id),
    CONSTRAINT uq_stack_technology UNIQUE (technology)
);

CREATE TABLE project
(
    id           SERIAL,
    name         TEXT NOT NULL,
    slug         TEXT NOT NULL,
    preview_url  TEXT NOT NULL,
    employer     TEXT,
    description  TEXT NOT NULL,
    work_started DATE NOT NULL,
    work_ended   DATE NOT NULL,
    is_featured  BOOLEAN DEFAULT FALSE,
    git          TEXT,

    CONSTRAINT pk_project PRIMARY KEY (id),
    CONSTRAINT uq_project_name UNIQUE (name),
    CONSTRAINT uq_project_slug UNIQUE (slug)
);

CREATE TABLE project_media
(
    id         SERIAL,
    type       TEXT    NOT NULL,
    url        TEXT    NOT NULL,
    sort_order INTEGER,
    caption    TEXT,
    project_id INTEGER NOT NULL,

    CONSTRAINT pk_project_media PRIMARY KEY (id),
    CONSTRAINT fk_project_media_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT chk_project_media_type CHECK (type IN ('PHOTO', 'VIDEO', 'GIF'))
);

CREATE TABLE developers
(
    id       SERIAL,
    name     TEXT,
    surname  TEXT,
    nickname TEXT,

    CONSTRAINT pk_developers PRIMARY KEY (id),
    CONSTRAINT chk_developers_at_least_one_name CHECK (
        COALESCE(name, surname, nickname) IS NOT NULL
        )
);

CREATE TABLE stack_project_cross_ref
(
    project_id    INTEGER NOT NULL,
    technology_id INTEGER NOT NULL,

    CONSTRAINT pk_stack_project_cross_ref PRIMARY KEY (project_id, technology_id),
    CONSTRAINT fk_stack_project_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_stack_project_stack FOREIGN KEY (technology_id) REFERENCES stack (id) ON DELETE CASCADE
);

CREATE TABLE dev_project_cross_ref
(
    dev_id     INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    role       TEXT    NOT NULL,

    CONSTRAINT pk_dev_project_cross_ref PRIMARY KEY (dev_id, project_id, role),
    CONSTRAINT fk_dev_project_dev FOREIGN KEY (dev_id) REFERENCES developers (id) ON DELETE CASCADE,
    CONSTRAINT fk_dev_project_project FOтищREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
);