import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, Length } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    length: 80,
  })
  @Length(10, 80)
  public name!: string;

  @Column({
    length: 100,
  })
  @Length(10, 100)
  @IsEmail()
  public email!: string;
}

export const userSchema = {
  id: { type: "number", required: true, example: 1 },
  name: { type: "string", required: true, example: "Javier" },
  email: { type: "string", required: true, example: "avileslopez.javier@gmail.com" },
};
