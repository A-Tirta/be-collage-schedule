// Important: Import the HasMany decorator and the Order model
import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Order } from "./order"; // Use the correct path to your Order model

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model {
  // --- Association Definition ---
  @HasMany(() => Order) // Creates the User.hasMany(Order) association
  orders!: Order[]; // This property will hold an array of Order objects

  // ... your other columns are fine ...
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  password!: string;
}
