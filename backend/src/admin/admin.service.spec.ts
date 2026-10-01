import {AdminService} from "./admin.service";
import {adminModel} from '../generated/prisma/models';
import {CreateAdminDto} from "./dto/create-admin.dto";
import {Test, TestingModule} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";
import {ConflictException, NotFoundException} from "@nestjs/common";
import * as argon2 from 'argon2';
import {UpdateAdminDto} from "./dto/update-admin.dto";
import {ChangeAdminPasswordDto} from "./dto/change-admin-password.dto";

describe('AdminService', () => {
    let service: AdminService;
    let prisma: any;

    const mockPrisma = {
        admin: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    };

    const fakeAdmin: adminModel = {
        id: 1,
        email: 'nijens@mail.com',
        password_hash: '$argon2id$v=19$m=65536,t=3,p=4$somesaltandhash'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminService, {provide: PrismaService, useValue: mockPrisma}]
        }).compile();

        service = module.get(AdminService);
        prisma = module.get(PrismaService);
    });

    afterEach(async () => jest.clearAllMocks());

    const createDto: CreateAdminDto = {
        email: 'nijens@mail.com',
        password: 'testPassword'
    }

    describe('createAdmin', () => {
        it('should create admin and return ReadAdminDto without password_hash', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);
            prisma.admin.create.mockResolvedValue(fakeAdmin);

            const result = await service.createAdmin(createDto);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {email: createDto.email}});

            expect(prisma.admin.create).toHaveBeenCalledWith({
                data: {
                    email: createDto.email,
                    password_hash: expect.any(String),
                }
            });

            const createCallArgs = prisma.admin.create.mock.calls[0][0];
            expect(createCallArgs.data.password_hash).not.toEqual(createDto.password);

            expect(result).not.toHaveProperty('password_hash');
            expect(result.email).toEqual(fakeAdmin.email);
        });

        it('should throw ConflictException if admin with this email already exists', async () => {
            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);

            await expect(service.createAdmin(createDto)).rejects.toThrow(ConflictException);

            expect(prisma.admin.create).not.toHaveBeenCalled();
        });

        it('should actually hash the password with argon2 (real hash, not mocked)', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);
            prisma.admin.create.mockResolvedValue(fakeAdmin);

            await service.createAdmin(createDto);

            const createCallArgs = prisma.admin.create.mock.calls[0][0];
            const hashSentToDb = createCallArgs.data.password_hash;

            expect(hashSentToDb).toMatch(/^\$argon2/);
            const isValid = await argon2.verify(hashSentToDb, createDto.password);
            expect(isValid).toBe(true);
        });
    });

    describe('readAdmin', () => {
        it('should return ReadAdminDto without password_hash', async () => {
            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);

            const result = await service.readAdminById(fakeAdmin.id);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {id: fakeAdmin.id}});
            expect(result.id).toEqual(fakeAdmin.id);
            expect(result).not.toHaveProperty('password_hash');
        });

        it('should throw NotFoundException if admin with this id does not exist', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);

            await expect(service.readAdminById(2)).rejects.toThrow(NotFoundException);
            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {id: 2}});
        });
    });

    const updateDto: UpdateAdminDto = {
        email: 'newnijens@mail.com'
    }

    describe('updateAdmin', async () => {
        it('should update admin and return ReadAdminDto without password_hash', async () => {
            const updatedAdmin: adminModel = { ...fakeAdmin, email: updateDto.email!}

            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);
            prisma.admin.update.mockResolvedValue(updatedAdmin);

            const result = await service.updateAdminById(fakeAdmin.id, createDto);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {id: fakeAdmin.id}});
            expect(result).not.toHaveProperty('password_hash');
        });

        it('should throw NotFoundException if admin with this id does not exist', async () => {

        });
    });

    const updatePasswordDto: ChangeAdminPasswordDto = {
        currentPassword: 'testPassword',
        newPassword: 'newTestPassword'
    }

    describe('changePassword', async () => {

    });

    describe('deleteAdmin', async () => {

    });
});