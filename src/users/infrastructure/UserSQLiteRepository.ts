import { Database } from 'sqlite3';
import { UserRepository } from "../domain/repositories/UserRepository";
import { User } from "../domain/User";
import { UserEmail } from "../domain/value-objects/UserEmail.value-objects";
import { UserId } from "../domain/value-objects/UserId.value-objects";
import { UserName } from "../domain/value-objects/UserName.value-objects";
import { UserSurname } from "../domain/value-objects/UserSurname.value-objects";
import { UserDateOfBirth } from "../domain/value-objects/UserDateOfBirth.value-objects";
import { UserCreatedAtDate } from "../domain/value-objects/UserCreatedAtDate.value-objects";
import { UserUpdatedAtDate } from "../domain/value-objects/UserUpdatedAtDate.value-objects";
import { DatabaseInitializationError } from "../domain/errors/DatabaseInitializationError";

export class UserSQLiteRepository implements UserRepository {
    private db: Database;
    private initialized: Promise<void>;
    private closed: boolean = false;

    constructor(dbPath: string) {
        if (!dbPath) {
            throw new DatabaseInitializationError('Database path is required');
        }

        try {
            this.db = new Database(dbPath);
            this.initialized = this.initializeTable();
        } catch (error) {
            throw new DatabaseInitializationError('Failed to initialize database');
        }
    }

    private initializeTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        surname TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        date_of_birth TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                `, (err) => {
                    if (err) reject(err);
                    else {
                        this.db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            });
        });
    }

    private async ensureInitialized(): Promise<void> {
        if (this.closed) {
            throw new Error('Database connection is closed');
        }
        await this.initialized;
    }

    async save(user: User): Promise<void> {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT OR REPLACE INTO users (id, name, surname, email, date_of_birth, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    user.id.toString(),
                    user.name.toString(),
                    user.surname.toString(),
                    user.email.toString(),
                    user.dateOfBirth.toString(),
                    user.getCreatedAt(),
                    user.getUpdatedAt()
                ],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    async delete(userId: UserId): Promise<void> {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM users WHERE id = ?',
                [userId.toString()],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    async findById(userId: UserId): Promise<User | null> {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE id = ?',
                [userId.toString()],
                (err, row: any) => {
                    if (err) reject(err);
                    else if (!row) resolve(null);
                    else {
                        try {
                            resolve(this.mapRowToUser(row));
                        } catch (error) {
                            reject(error);
                        }
                    }
                }
            );
        });
    }

    async findByEmail(email: UserEmail): Promise<User | null> {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE email = ?',
                [email.toString()],
                (err, row: any) => {
                    if (err) reject(err);
                    else if (!row) resolve(null);
                    else {
                        try {
                            resolve(this.mapRowToUser(row));
                        } catch (error) {
                            reject(error);
                        }
                    }
                }
            );
        });
    }

    async findAll(): Promise<User[]> {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM users', [], (err, rows: any[]) => {
                if (err) reject(err);
                else {
                    try {
                        resolve(rows.map(row => this.mapRowToUser(row)));
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }

    private mapRowToUser(row: any): User {
        return new User(
            UserId.create(row.id),
            new UserName(row.name),
            new UserSurname(row.surname),
            new UserEmail(row.email),
            new UserDateOfBirth(new Date(row.date_of_birth)),
            new UserCreatedAtDate(new Date(row.created_at)),
            new UserUpdatedAtDate(new Date(row.updated_at))
        );
    }
}
