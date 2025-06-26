// Important: Import the association decorators
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user"; // Import the actual model classes
import { Product } from "./product";

@Table({
  tableName: "orders",
  timestamps: true,
})
export class Order extends Model {
  // --- Foreign Key for User ---
  @ForeignKey(() => User) // Defines this column as a foreign key
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  // --- This is the association object ---
  @BelongsTo(() => User) // Creates the Order.belongsTo(User) association
  user!: User; // This will hold the included User object

  // --- Foreign Key for Product ---
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id!: number;

  // --- This is the association object ---
  @BelongsTo(() => Product)
  product!: Product;

  // ... other columns are fine ...
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantity!: number;

  // ... other columns are fine ...
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  price_per_unit!: number;

  // ... other columns are fine ...
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  line_total!: number;

  // ... other columns are fine ...
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status!: string;
}
