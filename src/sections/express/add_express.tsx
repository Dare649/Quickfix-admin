import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Box ,
  Button,
  useTheme,
  TextField,
} from '@mui/material';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { mutate } from 'swr';

const AddExpress = ({ setOpen }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    name: Yup.string().required('Express title is required'),
    fee: Yup.number().required('Fee is required'),
  });

  //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      name: '',
      fee: '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));

        // Now make a trip to create a new product here
        const payload = {
          ...values,
        };

        const response = APIService.addExpress(payload);
        toast.promise(response, {
          pending: {
            render() {
              return 'Loading. Please wait...';
            },
            icon: false,
          },
          success: {
            render({ data }) {
              dispatch(setLoading(false));
              mutate('/admins/express/all')
              const res = data?.data?.message || 'New express added successfully';
              setOpen(false);
              return `${res}`;
            },
          },
          error: {
            render({ data }: any) {
              dispatch(setLoading(false));
              console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
              const errorMsg = data?.response?.data?.message || data?.message || '';
              // When the promise reject, data will contains the error
              return `${errorMsg ?? 'An error occurred!'}`;
            },
          },
        });
      } catch (error) {
        dispatch(setLoading(false));
        console.log('SOCIAL ERR :: ', error);
      }
    },
  });

  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
    <Box p={4} minWidth={300}>
      <TextField
        variant="outlined"
        fullWidth
        required
        placeholder="Express title"
        label="Title"
        {...getFieldProps('name')}
        error={Boolean(touched.name && errors.name)}
        helperText={touched.name && errors.name}
      />
      <Box p={1} />
      <TextField
        variant="outlined"
        fullWidth
        required
        type="number"
        placeholder="Express fee(%)"
        onInput={(e: any) => {
          e.target.value = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 3);
        }}
        label="Fee"
        {...getFieldProps('fee')}
        error={Boolean(touched.fee && errors.fee)}
        helperText={touched.fee && errors.fee}
      />

      <Box p={1} />
      <Button
        fullWidth
        disabled={isLoading}
        variant="contained"
        onClick={() => handleSubmit()}
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddExpress;
