import { ObjectId } from 'mongodb';

export class QueryBuilder {
  private readonly query: Record<string, unknown>[] = [];

  match = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $match: data,
    });
    return this;
  };

  group = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $group: data,
    });
    return this;
  };

  unwind = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $unwind: data,
    });
    return this;
  };

  lookup = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $lookup: data,
    });
    return this;
  };

  addFields = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $addFields: data,
    });
    return this;
  };

  project = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $project: data,
    });
    return this;
  };

  sort = (data: Record<string, unknown>): QueryBuilder => {
    this.query.push({
      $sort: data,
    });
    return this;
  };

  build = (): Record<string, unknown>[] => this.query;
}
