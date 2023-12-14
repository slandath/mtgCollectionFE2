import { test, expect } from "@playwright/test";
import { CreateAccountPage } from "../pages/createAccountPage";
import { LoginPage } from "../pages/loginPage";

type CreateFormOptions = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

type LoginFormOptions = {
  username: string;
  password: string;
};

test.describe("Create Account Tests", () => {
  test("Successful create valid account", async ({ page }) => {
    const createAccountPage = new CreateAccountPage(page);
    const loginPage = new LoginPage(page);

    const createFormData: CreateFormOptions = {
      username: "testuser",
      password: "testpass",
      firstName: "test",
      lastName: "user",
    };

    const loginFormData: LoginFormOptions = {
      username: createFormData.username,
      password: createFormData.password,
    };

    await test.step("Navigate to the page", async () => {
      await createAccountPage.goto();
    });

    await test.step("Fill out form and submit", async () => {
      await createAccountPage.createAccountUI(createFormData);
    });

    await test.step("Login with new account", async () => {
      await page.waitForURL("/");
      await loginPage.loginUI(loginFormData);
    });

    await test.step("Assertion", async () => {
      await page.waitForURL("/collection");
      expect(page.url()).toContain("/collection");
    });

    await test.step("Cleanup", async () => {
      const userToken: string | null = await page.evaluate(() => {
        return window.localStorage.getItem("token");
      });
      await createAccountPage.deleteAccountAPI({ token: userToken });
    });
  });
});