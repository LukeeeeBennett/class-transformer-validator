"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.use(chai_as_promised_1.default);
const index_1 = require("../index");
class User {
    greet() {
        return "Greeting";
    }
}
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
describe("transformAndValidate()", () => {
    let user;
    const rejectMessage = "Incorrect object param type! Only string, plain object and array of plain objects are valid.";
    beforeEach(() => {
        user = {
            email: "test@test.com",
        };
    });
    it("should successfully transform and validate User plain object", () => __awaiter(void 0, void 0, void 0, function* () {
        const transformedUser = yield index_1.transformAndValidate(User, user);
        chai_1.expect(transformedUser).to.exist;
        chai_1.expect(transformedUser.email).to.equals("test@test.com");
        chai_1.expect(transformedUser.greet()).to.equals("Greeting");
    }));
    it("should successfully transform and validate JSON with User object", () => __awaiter(void 0, void 0, void 0, function* () {
        const userJson = JSON.stringify(user);
        const transformedUser = (yield index_1.transformAndValidate(User, userJson));
        chai_1.expect(transformedUser).to.exist;
        chai_1.expect(transformedUser.email).to.equals("test@test.com");
        chai_1.expect(transformedUser.greet()).to.equals("Greeting");
    }));
    it("should successfully transform and validate JSON with array of Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const userJson = JSON.stringify([user]);
        const transformedUsers = (yield index_1.transformAndValidate(User, userJson));
        chai_1.expect(transformedUsers).to.exist;
        chai_1.expect(transformedUsers).to.be.an.instanceof(Array);
        chai_1.expect(transformedUsers).to.have.lengthOf(1);
        chai_1.expect(transformedUsers[0].email).to.equals("test@test.com");
        chai_1.expect(transformedUsers[0].greet()).to.equals("Greeting");
    }));
    it("should successfully transform and validate array of User objects", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = [user, user, user];
        const transformedUsers = yield index_1.transformAndValidate(User, users);
        chai_1.expect(transformedUsers).to.exist;
        chai_1.expect(transformedUsers).to.have.lengthOf(3);
        chai_1.expect(transformedUsers[0].email).to.equals("test@test.com");
        chai_1.expect(transformedUsers[1].greet()).to.equals("Greeting");
    }));
    it("should throw ValidationError array when object property is not passing validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            email: "test@test",
        };
        const error = yield chai_1.expect(index_1.transformAndValidate(User, sampleUser)).to.be.rejected;
        chai_1.expect(error).to.have.lengthOf(1);
        chai_1.expect(error[0]).to.be.instanceOf(class_validator_1.ValidationError);
    }));
    it("should throw ValidationError array when json's property is not passing validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            email: "test@test",
        };
        const userJson = JSON.stringify(sampleUser);
        const error = yield chai_1.expect(index_1.transformAndValidate(User, userJson)).to.be.rejected;
        chai_1.expect(error).to.have.lengthOf(1);
        chai_1.expect(error[0]).to.be.instanceOf(class_validator_1.ValidationError);
    }));
    it("should throw array of ValidationError arrays when properties of objects from array are not passing validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            email: "test@test",
        };
        const users = [sampleUser, sampleUser, sampleUser];
        const error = yield chai_1.expect(index_1.transformAndValidate(User, users)).to.be.rejected;
        chai_1.expect(error).to.have.lengthOf(users.length);
        chai_1.expect(error[0]).to.have.lengthOf(1);
        chai_1.expect(error[0][0]).to.be.instanceOf(class_validator_1.ValidationError);
    }));
    it("should throw SyntaxError while parsing invalid JSON string", () => __awaiter(void 0, void 0, void 0, function* () {
        const userJson = JSON.stringify(user) + "error";
        const error = yield chai_1.expect(index_1.transformAndValidate(User, userJson)).to.be.rejected;
        chai_1.expect(error).to.be.instanceOf(SyntaxError);
    }));
    it("should throw Error when object parameter is a number", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = yield chai_1.expect(index_1.transformAndValidate(User, 2)).to
            .be.rejected;
        chai_1.expect(error).to.exist;
        chai_1.expect(error.message).to.equals(rejectMessage);
    }));
    it("should throw Error when object parameter is a function", () => __awaiter(void 0, void 0, void 0, function* () {
        const func = () => ({ email: "test@test.com" });
        const error = yield chai_1.expect(index_1.transformAndValidate(User, func)).to.be
            .rejected;
        chai_1.expect(error).to.exist;
        chai_1.expect(error.message).to.equals(rejectMessage);
    }));
    it("should throw Error when object parameter is a boolean value", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = yield chai_1.expect(index_1.transformAndValidate(User, true))
            .to.be.rejected;
        chai_1.expect(error).to.exist;
        chai_1.expect(error.message).to.equals(rejectMessage);
    }));
    it("should throw Error when object parameter is a null", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = yield chai_1.expect(index_1.transformAndValidate(User, null))
            .to.be.rejected;
        chai_1.expect(error).to.exist;
        chai_1.expect(error.message).to.equals(rejectMessage);
    }));
    it("should throw Error when object parameter is an undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = yield chai_1.expect(index_1.transformAndValidate(User, void 0))
            .to.be.rejected;
        chai_1.expect(error).to.exist;
        chai_1.expect(error.message).to.equals(rejectMessage);
    }));
});
describe("transformAndValidateSync()", () => {
    let user;
    const rejectMessage = "Incorrect object param type! Only string, plain object and array of plain objects are valid.";
    beforeEach(() => {
        user = {
            email: "test@test.com",
        };
    });
    it("should successfully transform and validate User plain object", () => __awaiter(void 0, void 0, void 0, function* () {
        const transformedUser = index_1.transformAndValidateSync(User, user);
        chai_1.expect(transformedUser).to.exist;
        chai_1.expect(transformedUser.email).to.equals("test@test.com");
        chai_1.expect(transformedUser.greet()).to.equals("Greeting");
    }));
    it("should successfully transform and validate JSON with User object", () => __awaiter(void 0, void 0, void 0, function* () {
        const userJson = JSON.stringify(user);
        const transformedUser = index_1.transformAndValidateSync(User, userJson);
        chai_1.expect(transformedUser).to.exist;
        chai_1.expect(transformedUser.email).to.equals("test@test.com");
        chai_1.expect(transformedUser.greet()).to.equals("Greeting");
    }));
    it("should successfully transform and validate JSON with array of Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const userJson = JSON.stringify([user]);
        const transformedUsers = index_1.transformAndValidateSync(User, userJson);
        chai_1.expect(transformedUsers).to.exist;
        chai_1.expect(transformedUsers).to.be.an.instanceof(Array);
        chai_1.expect(transformedUsers).to.have.lengthOf(1);
        chai_1.expect(transformedUsers[0].email).to.equals("test@test.com");
        chai_1.expect(transformedUsers[0].greet()).to.equals("Greeting");
    }));
    it("should successfully transform and validate array of User objects", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = [user, user, user];
        const transformedUsers = index_1.transformAndValidateSync(User, users);
        chai_1.expect(transformedUsers).to.exist;
        chai_1.expect(transformedUsers).to.have.lengthOf(3);
        chai_1.expect(transformedUsers[0].email).to.equals("test@test.com");
        chai_1.expect(transformedUsers[1].greet()).to.equals("Greeting");
    }));
    it("should throw ValidationError array when object property is not passing validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            email: "test@test",
        };
        try {
            index_1.transformAndValidateSync(User, sampleUser);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.have.lengthOf(1);
            chai_1.expect(error[0]).to.be.instanceOf(class_validator_1.ValidationError);
        }
    }));
    it("should throw ValidationError array when json's property is not passing validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            email: "test@test",
        };
        const userJson = JSON.stringify(sampleUser);
        try {
            index_1.transformAndValidateSync(User, userJson);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.have.lengthOf(1);
            chai_1.expect(error[0]).to.be.instanceOf(class_validator_1.ValidationError);
        }
    }));
    it("should throw array of ValidationError arrays when properties of objects from array are not passing validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            email: "test@test",
        };
        const users = [sampleUser, sampleUser, sampleUser];
        try {
            index_1.transformAndValidateSync(User, users);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.have.lengthOf(users.length);
            chai_1.expect(error[0]).to.have.lengthOf(1);
            chai_1.expect(error[0][0]).to.be.instanceOf(class_validator_1.ValidationError);
        }
    }));
    it("should throw SyntaxError while parsing invalid JSON string", () => __awaiter(void 0, void 0, void 0, function* () {
        const userJson = JSON.stringify(user) + "error";
        try {
            index_1.transformAndValidateSync(User, userJson);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.be.instanceOf(SyntaxError);
        }
    }));
    it("should throw Error when object parameter is a number", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            index_1.transformAndValidateSync(User, 2);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.exist;
            chai_1.expect(error.message).to.equals(rejectMessage);
        }
    }));
    it("should throw Error when object parameter is a function", () => __awaiter(void 0, void 0, void 0, function* () {
        const func = () => ({ email: "test@test.com" });
        try {
            index_1.transformAndValidateSync(User, func);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.exist;
            chai_1.expect(error.message).to.equals(rejectMessage);
        }
    }));
    it("should throw Error when object parameter is a boolean value", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            index_1.transformAndValidateSync(User, true);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.exist;
            chai_1.expect(error.message).to.equals(rejectMessage);
        }
    }));
    it("should throw Error when object parameter is a null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            index_1.transformAndValidateSync(User, null);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.exist;
            chai_1.expect(error.message).to.equals(rejectMessage);
        }
    }));
    it("should throw Error when object parameter is an undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            index_1.transformAndValidateSync(User, void 0);
            throw new Error("error should be thrown");
        }
        catch (error) {
            chai_1.expect(error).to.exist;
            chai_1.expect(error.message).to.equals(rejectMessage);
        }
    }));
});
