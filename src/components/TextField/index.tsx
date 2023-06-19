import { TextField } from "@mui/material";
import { useEffect } from "react";

interface TextFieldProps{
    correct: boolean;
    setCorrect: (state: boolean) => void;
    label: string;
    state: string;
    setState: (state: string) => void
    type: string;
    isFormSubmitted?: boolean;
    disabled?: boolean;
}

export function StyledTextField({correct, setCorrect, label, state, setState, type, isFormSubmitted, disabled}: TextFieldProps) {

    function handleCorrectState () {
        if (!state) {
            setCorrect(false);
        } else {
            setCorrect(true);
        }
    }

    useEffect(() => {
        handleCorrectState();
    }, [state])

    return (
        <TextField
            variant="outlined"
            margin="normal"
            label={label}
            fullWidth
            required
            onChange={(event) => setState(event.target.value)}
            value={state}
            helperText={(!correct && isFormSubmitted) && "O campo e obrigatorio!"}
            error={!correct && isFormSubmitted}
            type={type}
            disabled={disabled}
        />

    )
}