
'use client';
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from "next/link";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { signUpUser } from "@/redux/signupSlice";


const schema = yup.object().shape({
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(3, "Password must be at least 3 characters").required("Password is required"),
  gender: yup.string().required("Gender is required"),
 
});

interface formData {
  name: string;
  email: string;
  password: string;
  gender: string;

}

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: formData) => {
    dispatch(signUpUser(data))
      .unwrap()
      .then(() => {

        setTimeout(() => {
          router.push('/login');
        }, 1000);
      })
      .catch((err) => {

        console.error(err);
      });
    console.log(data)
  };

  return (
    <>


      <Box display={"flex"} paddingTop={"6%"} width={'100vw'}>
        <Box
          sx={{
            minWidth: 300,
            mx: "auto",
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            width: "50%",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Signup
          </Typography>
          <h6>Already have an account? <Link href={'/login'}>Login</Link></h6>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <FormControl margin="normal">
              <FormLabel>Gender</FormLabel>
              <RadioGroup row>
                <FormControlLabel value="m" control={<Radio {...register("gender")} />} label="Male" />
                <FormControlLabel value="f" control={<Radio {...register("gender")} />} label="Female" />
                <FormControlLabel value="u" control={<Radio {...register("gender")} />} label="Other" />
              </RadioGroup>
              {errors.gender && <p style={{ color: 'red' }}>{errors.gender.message}</p>}
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Signup
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Signup;