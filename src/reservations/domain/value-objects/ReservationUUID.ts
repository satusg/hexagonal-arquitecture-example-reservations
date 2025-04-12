import { uuidv7, UUID } from "uuidv7";
import ReservationUUIDInvalidError from "../errors/ReservationUUIDInvalidError";

export default class ReservationUUID {
  private readonly value: UUID;

  private constructor(uuid: string) {
    if (!ReservationUUID.isValid(uuid)) {
      throw new ReservationUUIDInvalidError("The provided UUID is not valid");
    }
    this.value = UUID.parse(uuid);
  }

  public static generate(): ReservationUUID {
    return new ReservationUUID(uuidv7());
  }

  public static fromString(uuid: string): ReservationUUID {
    return new ReservationUUID(uuid);
  }

  private static isValid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  getValue(): UUID {
    return this.value;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ReservationUUID)) {
      return false;
    }
    return this.value.toString() === other.value.toString();
  }
  

  toString(): string {
    return this.value.toString();
  }
}
