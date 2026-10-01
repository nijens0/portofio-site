import {Module} from '@nestjs/common';
import {StackController} from "./stack.controller";
import {StackService} from "./stack.service";

@Module({
    imports: [],
    controllers: [StackController],
    providers: [StackService],
})
export class StackModule {}