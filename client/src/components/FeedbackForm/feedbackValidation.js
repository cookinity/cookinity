import * as Yup from 'yup';
const FILE_SIZE = 5000000; // 5mb
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.string().required('Description is required'),
    toBring: Yup.string(),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    zip: Yup.string().required('Zip Code is required'),
    state: Yup.string().required('State is required'),
    street: Yup.string().required('Street is required'),
    veganFriendly: Yup.boolean(),
    vegetarianFriendly: Yup.boolean(),
    nutAllergyFriendly: Yup.boolean(),
    minGuests: Yup.number()
        .required('Min. Guests is required')
        .positive('Min. Guests must be positive')
        .min(1, 'Min. Guests minimum 1')
        .max(100, 'Min. Guests maximum 100')
        .integer('Min. Guests must be an integer'),
    maxGuests: Yup.number()
        .required('Min. Guests is required')
        .positive('Min. Guests must be positive')
        .max(100, 'Max. Guests maximum 100')
        .integer('Min. Guests must be an integer')
        .min(Yup.ref('minGuests'), 'Max. Guests must be at least as large as Min. Guests'),
    pricePerPerson: Yup.number()
        .required('Price is required')
        .positive('Price must be positive')
        .test(
            'maxDigitsAfterDecimal',
            'The prcie must have two digits after decimal or less',
            (number) => /^\d+(\.\d{1,2})?$/.test(String(number)),
        ),
    durationInMinutes: Yup.number()
        .required('Duration is required')
        .positive('Duration must be positive')
        .integer('Duration must be an integer'),
});
