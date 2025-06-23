// Important: Import the HasMany decorator and the Order model
import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Order } from "./order"; // Use the correct path to your Order model

@Table({
  tableName: "products",
  timestamps: true,
})
export class Product extends Model {
  // --- Association Definition ---
  @HasMany(() => Order) // Creates the User.hasMany(Order) association
  orders!: Order[]; // This property will hold an array of Order objects

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock_quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: 0, // Default to false
  })
  is_active!: number;
}
