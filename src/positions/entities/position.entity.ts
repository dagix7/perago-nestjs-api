import { Entity, PrimaryGeneratedColumn, Column, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity()
@Tree("materialized-path") // This is a high-performance way to handle trees
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @TreeParent() // This creates the 'parentId' relationship
  parent: Position;

  @TreeChildren()
  children: Position[];
}