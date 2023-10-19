import React, { useState } from 'react';
import { Box, FormControl, Input, WarningOutlineIcon, Pressable } from "native-base"
import { MaterialIcons } from '@expo/vector-icons';



export default function SigninGroup({ email, password, shouldValidate, onEmailChange, onPasswordChange }) {
    const isEmailInvalid = shouldValidate && !email;
    const isPasswordInvalid = shouldValidate && !password;
    const [show, setShow] = useState(false);

    return (
        <Box alignItems="center" paddingBottom={"10"}>
            <FormControl isInvalid={isEmailInvalid} width={"200"}>
                <FormControl.Label>Email</FormControl.Label>
                <Input 
                    placeholder="Enter email"
                    value={email}
                    onChangeText={onEmailChange}
                    type='email'
                />
                {isEmailInvalid && (
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Please enter email
                    </FormControl.ErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isPasswordInvalid} width={"200"}>
                <FormControl.Label>Password</FormControl.Label>
                <Input 
                    placeholder="Enter password" 
                    value={password}
                    onChangeText={onPasswordChange}
                    type={show ? "text" : "password"}
                    InputRightElement={<Pressable onPress={() => setShow(!show)}>
                        <MaterialIcons name={show ? "visibility" : "visibility-off"} size={20} color="gray" margin={5}/>
                    </Pressable>}
                />
                {isPasswordInvalid && (
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Please enter the password
                    </FormControl.ErrorMessage>
                )}
            </FormControl>
        </Box>
    );
}
