import * as Yup from 'yup';
const FILE_SIZE = 5000000; // 5mb
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  zip: Yup.string().required('Zip Code is required'),
  state: Yup.string().required('State is required'),
  street: Yup.string().required('Street is required'),
  coverPhoto: Yup.mixed()
    .test('fileSize', 'File too large. Maximum is 5mb', (value) =>
      value ? value.size <= FILE_SIZE : true,
    )
    .test('fileFormat', 'Unsupported Format. Please upload jpg, jpeg or png', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
  photoOne: Yup.mixed()
    .test('fileSize', 'File too large. Maximum is 5mb', (value) =>
      value ? value.size <= FILE_SIZE : true,
    )
    .test('fileFormat', 'Unsupported Format. Please upload jpg, jpeg or png', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
  photoTwo: Yup.mixed()
    .test('fileSize', 'File too large. Maximum is 5mb', (value) =>
      value ? value.size <= FILE_SIZE : true,
    )
    .test('fileFormat', 'Unsupported Format. Please upload jpg, jpeg or png', (value) =>
      value ? SUPPORTED_FORMATS.includes(value.type) : true,
    ),
});
