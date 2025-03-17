import "jest-fetch-mock";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
jest.mock("axios");
jest.mock("axios-mock-adapter");
global.alert = jest.fn();