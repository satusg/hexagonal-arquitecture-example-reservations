export type CreateReservationDTO = {
    customer: {
        name: string,
        email: string
    },
    date: string;
    type: string;
    uuid: string;
};