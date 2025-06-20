
'use client';
import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Category } from "@mui/icons-material";


const schema = yup.object().shape({
  title: yup
    .string()
    .required("title is required"),
  description: yup
    .string()
    .required("description is required"),

    category:yup
    .string()
    .required("category is required")
});

interface FormData {
  title: string;
  description: string;
  category:string
}

const ModalForm = () => {

      const router = useRouter();
     //   const user = useSelector((state: RootState) => state.login.user);
    
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>({
        resolver: yupResolver(schema),
      });
    
      const onSubmit = (data: FormData) => {
       
        console.log(data)
      };
  return (
    <Box>
        <Typography>Create Group</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
            //   type="password"
              fullWidth
              margin="normal"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />


            <TextField
              label="Category"
            //   type="password"
              fullWidth
              margin="normal"
              {...register("category")}
              error={!!errors.category}
              helperText={errors.category?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Create
            </Button>
          </form>
        
    </Box>
  )
}

export default ModalForm