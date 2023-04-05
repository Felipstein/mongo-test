import { Document } from 'mongoose';
import { ConnectionEntity } from '../entities/connection.entity';

type ConnectionDomain = ConnectionEntity;
type ConnectionMongo = Document<unknown, {}, ConnectionEntity> & Omit<ConnectionEntity & { _id: string }, never>;

export class ConnectionMapper {

  static mongoToDomain(connectionMongo: ConnectionMongo): ConnectionDomain {
    return {
      id: connectionMongo._id.toString(),
      name: connectionMongo.name,
      workspaceId: connectionMongo.workspaceId.toString(),
      brands: connectionMongo.brands.map(brand => ({
        id: brand.id.toString(),
      })),
      credentials: connectionMongo.credentials,
    };
  }

}