import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  title: string;
  description?: string;
  assignee?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  status?: TaskStatus;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  assignee?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  status?: TaskStatus;
}
