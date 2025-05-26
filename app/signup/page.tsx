"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { postSignUp } from "../api/api";
import { useAuth } from "../contexts";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const payload = {
        name: values?.name,
        email: values?.email,
        password: values?.password,
      };

      const response = await postSignUp("auth/signup", payload);
      const data = await response?.json();

      if (response?.ok) {
        console.log("data.access_token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard");
      } else {
        // Show the API error message if available
        Swal.fire(
          "Error!",
          data?.message || "Failed to sign up. Please try again.",
          "error"
        );
        setIsLoading(false);
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "Something went wrong. Please try again later.",
        "error"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Title level={3}>Create an account</Title>
          <Text type="secondary">
            Enter your email below to create your account
          </Text>
        </div>

        <Card>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
