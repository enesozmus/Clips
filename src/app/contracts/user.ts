import { Interface } from "readline";

/*
    The interfaces are a feature for creating custom types.
    The interface we will create will describe the contents of an object any collection.
    Interfaces are useful for modeling basic objects.
    Interfaces are a feature of TypeScript. TypeScript is not supported in the browser.
*/
export default interface IUser{
    email: string,
    password?: string,
    name: string,
    age: number,
    phoneNumber: string,
}
/*
export default class User{
    email: string;
    password: string;
    name: string;
    age: number;
    phoneNumber: string;
}

    In some cases, projects may create models with classes instead of interfaces.
    we created a model with a class.
    Classes are an official feature of JavaScript.
    If we write a class, the class definition will get bundled with our app.
    Another advantage classes offer over interfaces is methods.
        - Keep in mind classes can increase the bundle size of our app.
*/