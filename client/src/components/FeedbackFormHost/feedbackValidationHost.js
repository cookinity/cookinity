import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    ratingCustomer: Yup.string(),
});
