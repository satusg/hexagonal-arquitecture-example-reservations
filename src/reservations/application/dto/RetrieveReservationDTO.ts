export type RetrieveReservationDTO = {
  uuid?: string;
  type?: string;
  date?: {
    from?: string,
    to?: string,
  },
  customer?: {
    email?: string,
    name?: string
  }
};