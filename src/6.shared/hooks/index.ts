import { AppDispatch, RootState } from "@shared/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";

const useAppDispatch = useDispatch<AppDispatch>
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export {
    useAppDispatch,
    useAppSelector
}
