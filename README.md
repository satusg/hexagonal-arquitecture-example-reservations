# 🏗️ TypeScript Hexagonal Architecture Example

<p align="center">
  Example of a TypeScript application implementing Hexagonal Architecture (Ports and Adapters),
  with clear separation of concerns, domain-driven design principles, and comprehensive testing.
</p>

## 🎯 Project Overview

This project demonstrates a clean implementation of Hexagonal Architecture in TypeScript, featuring:

- Clear separation of layers (Domain, Application, Infrastructure)
- Domain-Driven Design principles
- Comprehensive test coverage
- Clean and maintainable code structure
- SOLID principles adherence
- Dependency inversion for better testability

## 🏗️ Architecture

The project follows a hexagonal architecture pattern (also known as Ports and Adapters) with the following layers:

### Core Layers

- **Domain Layer**: Contains the core business logic and entities
  - User entity with business rules
  - Value objects for data validation
  - Domain errors and exceptions
  - Repository interfaces (ports)
  - No dependencies on external frameworks or libraries

- **Application Layer**: Implements use cases and orchestrates the domain layer
  - User builders for entity creation
  - Finders for querying users
  - Updators for modifying users
  - Deleters for removing users
  - Clean separation of concerns for each operation

- **Infrastructure Layer**: Handles external concerns like persistence
  - SQLite repository implementation
  - LocalStorage repository implementation
  - Adapters for the repository ports
  - Framework-specific code isolation

### Key Benefits

- **Independence of Frameworks**: The domain logic is isolated from external concerns
- **Testability**: Easy to write unit tests for domain logic without external dependencies
- **Flexibility**: Easy to swap implementations (e.g., changing between SQLite and LocalStorage)
- **Maintainability**: Clear separation of concerns makes the code easier to maintain
- **Scalability**: Easy to add new features without affecting existing code

### Project Structure

```
src/
├── users/
│   ├── domain/          # Core business logic and entities
│   │   ├── User.ts      # User entity
│   │   ├── errors/      # Domain errors
│   │   ├── value-objects/ # Value objects
│   │   └── repositories/ # Repository interfaces
│   ├── application/     # Use cases and application services
│   │   ├── builders/    # User creation
│   │   ├── finders/     # User queries
│   │   ├── updators/    # User updates
│   │   └── deleters/    # User deletion
│   └── infrastructure/  # External implementations and adapters
│       ├── UserSQLiteRepository.ts
│       └── UserLocalStorageRepository.ts
tests/                   # Test suites for all layers
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn
- SQLite (for database operations)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Running Tests ( Only reservations folder based on jest.config.js)

```bash
# Run all tests
npm test

# Run all tests and watch how they change.
npm test:watch

#Run all integration tests
test:integration
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🧪 Testing

The project includes comprehensive testing at all layers:

### Unit Tests
- User entity and value objects
- Application use cases (builders, finders, updators, deleters)
- Repository implementations

### Integration Tests
- SQLite repository operations
- LocalStorage repository operations
- Complete user management workflows

## 🛠️ Built With

- **Core**
  - TypeScript
  - Node.js
  - SQLite

- **Testing**
  - Jest
  - Mock implementations

- **Development Tools**
  - ESLint for code linting
  - Prettier for code formatting
  - Docker for containerization

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

- **Svyatoslav Gudymyak** - [satusg](https://github.com/satusg)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request