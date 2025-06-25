
// 'use client';

// import React, { useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Button,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Chip,
//   OutlinedInput,
// } from "@mui/material";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { fetchUsers } from "@/redux/groupSlice";

// // ✅ Validation schema
// const schema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   description: yup.string().required("Description is required"),
//   users: yup
//     .array()
//     .of(yup.number().required())
//     .min(1, "Please select at least one user")
//     .required("Users are required"),
// });

// // ✅ Type for form data
// interface FormData {
//   title: string;
//   description: string;
//   users: number[]; // ID array
// }

// // ✅ Dropdown config
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;

// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 300,
//     },
//   },
//   disablePortal: true,
// };

// const ModalForm = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { users } = useSelector((state: RootState) => state.user);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       title: "",
//       description: "",
//       users: [],
//     },
//   });

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // ✅ Form submit
//   const onSubmit: SubmitHandler<FormData> = (data) => {
//     const fullData = {
//       ...data,
//       createdBy: 4, // Default for now
//     };
//     console.log(" Final Submitted Data:", fullData);
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: "auto" }}>
//       <Typography variant="h6" gutterBottom>
//         Create Group
//       </Typography>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Title Input */}
//         <TextField
//           label="Title"
//           fullWidth
//           margin="normal"
//           {...register("title")}
//           error={!!errors.title}
//           helperText={errors.title?.message}
//         />

//         {/* Description Input */}
//         <TextField
//           label="Description"
//           fullWidth
//           margin="normal"
//           {...register("description")}
//           error={!!errors.description}
//           helperText={errors.description?.message}
//         />

//         {/* Multi-Select Users */}
//         <FormControl fullWidth margin="normal" error={!!errors.users}>
//           <InputLabel id="user-select-label">Select Users</InputLabel>
//           <Controller
//             name="users"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 labelId="user-select-label"
//                 multiple
//                 value={field.value}
//                 onChange={(e) =>
//                   field.onChange(
//                     typeof e.target.value === "string"
//                       ? e.target.value.split(",").map(Number)
//                       : e.target.value.map(Number)
//                   )
//                 }
//                 input={<OutlinedInput label="Select Users" />}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                     {selected.map((userId) => {
//                       const user = users.find((u) => u.id === userId);
//                       return (
//                         <Chip
//                           key={`chip-${userId}`}
//                           label={user?.name || userId}
//                         />
//                       );
//                     })}
//                   </Box>
//                 )}
//                 MenuProps={MenuProps}
//               >
//                 {users.map((user) => (
//                   <MenuItem key={user.id} value={user.id}>
//                     {user.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             )}
//           />
//           {errors.users && (
//             <Typography variant="caption" color="error">
//               {errors.users.message}
//             </Typography>
//           )}
//         </FormControl>

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Create Group
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default ModalForm;


'use client';

import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/groupSlice";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import
import { createGroup } from "@/redux/createGroupSlice";


const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),

});

interface FormData {
  title: string;
  description: string;
  
}


interface DecodedToken {
  sub: number;
  useremail: string;
  iat: number;
  exp: number;
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
  disablePortal: true,
};

const ModalForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      // users: [],
    },
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  
  const getUserIdFromToken = (): number | null => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };


const onSubmit: SubmitHandler<FormData> = (data) => {
  dispatch(createGroup(data))
    .unwrap()
    .then((res) => {
      console.log(" Group created:", res);
    })
    .catch((err) => {
      console.error(" Error creating group:", err);
    });
};

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Create Group
      </Typography>

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
          fullWidth
          margin="normal"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

     
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Group
        </Button>
      </form>
    </Box>
  );
};

export default ModalForm;

