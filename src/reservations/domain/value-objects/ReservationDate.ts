import ReservationDateInvalidError from "../errors/ReservationDateInvalidError";

export default class ReservationDate {
  private constructor(private readonly date: Date) {
    this.validate();
  }

  static fromDate(date: Date): ReservationDate {
    return new ReservationDate(date);
  }

  static fromString(dateString: string): ReservationDate {
    const date = new Date(dateString);
    return new ReservationDate(date);
  }

  private validate(): void {
    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new ReservationDateInvalidError('Invalid date has been provided');
    }
  }

  public toString(): string {
    return this.date.toString();
  }

  public toISOString(): string {
    return this.date.toISOString();
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ReservationDate)) {
      return false;
    }
    return this.date.getTime() === other.date.getTime();
  }

  public isBeforeNow(): boolean {
    return this.date.getTime() < Date.now();
  }

  public isAfterNow(): boolean {
    return this.date.getTime() > Date.now();
  }

  public isBeforeDate(other: ReservationDate): boolean {
    return this.date.getTime() <= other.date.getTime(); 
  }
  
  public isAfterDate(other: ReservationDate): boolean {
    return this.date.getTime() >= other.date.getTime(); 
  }
  

  public getValue(): Date {
    return new Date(this.date.getTime());
  }
}
