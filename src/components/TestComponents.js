import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from './Login';

test('Render the Login Components', () => {
    render(<Login />);

    //getbyRole = getby HTML tag element
    const componentTest = screen.getByRole('heading');
    expect(componentTest).toHaveTextContent('0');
});

test('button click', () => {
    render(<Login />);

    fireEvent.click(button);
    expect(componentTest).toHaveTextContent

})