import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    overallrankingstars: Yup.number()
        .required('Overall Ranking is required')
        .positive('Overall Rankings must be positive')
        .min(1, 'Overall Ranking minimum 1')
        .max(5, 'Overall Ranking maximum 5')
        .integer('Overall Ranking must be an integer'),
    overallranking: Yup.string().required('Additional Text is required'),
    hostrankingstars: Yup.number()
        .required('Ranking of the host is required')
        .positive('Ranking of the host must be positive')
        .min(1, 'Ranking of the host minimum 1')
        .max(5, 'Ranking of the host maximum 5')
        .integer('Ranking of the host must be an integer'),
    hostranking: Yup.string().required('Additional Text is required'),
    tasterankingstars: Yup.number()
        .required('Ranking of the taste is required')
        .positive('Ranking of the taste must be positive')
        .min(1, 'Ranking of the taste minimum 1')
        .max(5, 'Ranking of the taste maximum 5')
        .integer('Ranking of the taste must be an integer'),
    tasteranking: Yup.string().required('Additional Text is required'),
    locationratingstars: Yup.number()
        .required('Ranking of the location is required')
        .positive('Ranking of the location must be positive')
        .min(1, 'Ranking of the location minimum 1')
        .max(5, 'Ranking of the location maximum 5')
        .integer('Ranking of the location must be an integer'),
    locationrating: Yup.string().required('Additional Text is required'),
    vtmrrankingstars: Yup.number()
        .required('Ranking of the Value to Money Ratio is required')
        .positive('Ranking of the Value to Money Ratio must be positive')
        .min(1, 'Ranking of the Value to Money Ratio minimum 1')
        .max(5, 'Ranking of the Value to Money Ratio maximum 5')
        .integer('Ranking of the Value to Money Ratio must be an integer'),
    vtmrranking: Yup.string().required('Additional Text is required'),
    experiencerankingstars: Yup.number()
        .required('Ranking of the experience is required')
        .positive('Ranking of the experience must be positive')
        .min(1, 'Ranking of the experience minimum 1')
        .max(5, 'Ranking of the experience maximum 5')
        .integer('Ranking of the experience must be an integer'),
    experienceranking: Yup.string().required('Additional Text is required'),
    //Classid missing
});
