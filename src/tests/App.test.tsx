import App from "../App";
import { render, screen, fireEvent } from "@testing-library/react";

test("Addition and subtraction", () => {
    render(<App />);

    // Initial calculator
    let textField = screen.getByRole("math");
    expect(textField.textContent).toEqual("0");

    // 1 + 1 = 2
    function click(character: string) {
        let button = screen.getByRole("button", { name: character });
        fireEvent.click(button);
    }

    click("1");
    click("+");
    click("1");

    expect(textField.textContent).toEqual("1 + 1");

    click("=");

    expect(textField.textContent).toEqual("2");

    // Clear Entry
    click("Clear Entry");
    expect(textField.textContent).toEqual("0");

    // Leading decimal (0.333 + 4.667)
    click(".");
    click("3");
    click("3");
    click("3");

    expect(textField.textContent).toEqual(".333");

    click("+");

    expect(textField.textContent).toEqual("0.333 +");

    click("4");
    click(".");
    click("6");
    click("6");
    click("7");

    expect(textField.textContent).toEqual("0.333 + 4.667");

    click("=");

    expect(textField.textContent).toEqual("5");

    // Add to previous result
    click("+");

    expect(textField.textContent).toEqual("5 +");

    click("5");

    expect(textField.textContent).toEqual("5 + 5");

    click("=");

    expect(textField.textContent).toEqual("10");

    // First digit after result
    click("2");

    expect(textField.textContent).toEqual("2");

    // Equal with no operators
    click("=");
    expect(textField.textContent).toEqual("2");

    // Decimal after result
    click(".");
    expect(textField.textContent).toEqual(".");

    click("Clear Entry");

    // Leading sign
    click("-");
    expect(textField.textContent).toEqual("-");

    click("9");

    expect(textField.textContent).toEqual("-9");

    click("-");
    expect(textField.textContent).toEqual("-9 -");

    click("1");
    click("0");
    expect(textField.textContent).toEqual("-9 - 10");

    click("=");
    expect(textField.textContent).toEqual("-19");

    // Multiple decimals are impossible
    click(".");
    click(".");
    click(".");
    expect(textField.textContent).toEqual(".");

    click("2");
    click(".");
    click(".");
    expect(textField.textContent).toEqual(".2");

    click("Clear Entry");

    click("2");
    click(".");
    click("2");
    click(".");
    expect(textField.textContent).toEqual("2.2");

    click("Clear Entry")

    // Operator first after decimal
    click(".");
    click("+");
    click("3");
    expect(textField.textContent).toEqual("+3");

    click("Clear Entry");
    // Operator first after sign
    click("+");
    click("-");
    click("3");
    expect(textField.textContent).toEqual("-3");
});
