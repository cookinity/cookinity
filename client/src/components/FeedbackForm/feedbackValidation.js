import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    overallRating: Yup.string(),
    hostRating: Yup.string(),
    tasteRating: Yup.string(),
    locationRating: Yup.string(),
    vtmrRating: Yup.string(),
    experienceRating: Yup.string(),
});
