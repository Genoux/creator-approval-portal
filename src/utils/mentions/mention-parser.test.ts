import { describe, it, expect } from "vitest";
import { serializeMentions, deserializeMentions } from "./mention-parser";
import type { Comment, User } from "@/types";

describe("serializeMentions", () => {
	const mockUsers: User[] = [
		{
			id: 123,
			username: "john_doe",
			email: "john@example.com",
			initials: "JD",
			profilePicture: "https://example.com/john.jpg",
		},
		{
			id: 456,
			username: "jane_smith",
			email: "jane@example.com",
			initials: "JS",
			profilePicture: "https://example.com/jane.jpg",
		},
	];

	describe("plain text (no mentions, no links)", () => {
		it("should return comment_text for plain text", () => {
			const result = serializeMentions(
				"This is a plain comment",
				[],
				mockUsers,
			);
			expect(result).toEqual({
				comment_text: "This is a plain comment",
			});
		});

		it("should handle empty string", () => {
			const result = serializeMentions("", [], mockUsers);
			expect(result).toEqual({
				comment_text: "",
			});
		});
	});

	describe("text with mentions", () => {
		it("should serialize single mention", () => {
			const text = "Hey @[john_doe](123), check this out";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment).toBeDefined();
			expect(result.comment).toHaveLength(3);
			expect(result.comment?.[0]).toEqual({ text: "Hey " });
			expect(result.comment?.[1]).toEqual({
				type: "tag",
				user: { id: 123 },
			});
			expect(result.comment?.[2]).toEqual({ text: ", check this out" });
		});

		it("should serialize multiple mentions", () => {
			const text = "@[john_doe](123) and @[jane_smith](456) are here";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment).toHaveLength(4);
			expect(result.comment?.[0]).toEqual({
				type: "tag",
				user: { id: 123 },
			});
			expect(result.comment?.[1]).toEqual({ text: " and " });
			expect(result.comment?.[2]).toEqual({
				type: "tag",
				user: { id: 456 },
			});
			expect(result.comment?.[3]).toEqual({ text: " are here" });
		});

		it("should handle mention at start of text", () => {
			const text = "@[john_doe](123) started this";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment?.[0]).toEqual({
				type: "tag",
				user: { id: 123 },
			});
			expect(result.comment?.[1]).toEqual({ text: " started this" });
		});

		it("should handle mention at end of text", () => {
			const text = "Thanks @[jane_smith](456)";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment?.[0]).toEqual({ text: "Thanks " });
			expect(result.comment?.[1]).toEqual({
				type: "tag",
				user: { id: 456 },
			});
		});

		it("should handle consecutive mentions", () => {
			const text = "@[john_doe](123)@[jane_smith](456)";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment).toHaveLength(2);
			expect(result.comment?.[0]).toEqual({
				type: "tag",
				user: { id: 123 },
			});
			expect(result.comment?.[1]).toEqual({
				type: "tag",
				user: { id: 456 },
			});
		});

		it("should keep mention text if user not found", () => {
			const text = "Hey @[unknown_user](999)";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment?.[0]).toEqual({ text: "Hey " });
			expect(result.comment?.[1]).toEqual({ text: "@[unknown_user](999)" });
		});
	});

	describe("text with links", () => {
		it("should parse single URL", () => {
			const text = "Check this out https://example.com";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment).toBeDefined();
			expect(result.comment).toHaveLength(2);
			expect(result.comment?.[0]).toEqual({ text: "Check this out " });
			expect(result.comment?.[1]).toEqual({
				text: "https://example.com",
				attributes: { link: "https://example.com" },
			});
		});

		it("should parse multiple URLs", () => {
			const text =
				"See https://example.com and https://test.com for details";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment).toHaveLength(5);
			expect(result.comment?.[0]).toEqual({ text: "See " });
			expect(result.comment?.[1]).toEqual({
				text: "https://example.com",
				attributes: { link: "https://example.com" },
			});
			expect(result.comment?.[2]).toEqual({ text: " and " });
			expect(result.comment?.[3]).toEqual({
				text: "https://test.com",
				attributes: { link: "https://test.com" },
			});
			expect(result.comment?.[4]).toEqual({ text: " for details" });
		});

		it("should parse URL at start", () => {
			const text = "https://example.com is the link";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment?.[0]).toEqual({
				text: "https://example.com",
				attributes: { link: "https://example.com" },
			});
			expect(result.comment?.[1]).toEqual({ text: " is the link" });
		});

		it("should parse URL at end", () => {
			const text = "Link: https://example.com";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment?.[0]).toEqual({ text: "Link: " });
			expect(result.comment?.[1]).toEqual({
				text: "https://example.com",
				attributes: { link: "https://example.com" },
			});
		});

		it("should handle http and https URLs", () => {
			const text = "http://example.com and https://secure.com";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment?.[0]).toEqual({
				text: "http://example.com",
				attributes: { link: "http://example.com" },
			});
			expect(result.comment?.[2]).toEqual({
				text: "https://secure.com",
				attributes: { link: "https://secure.com" },
			});
		});
	});

	describe("text with mentions AND links", () => {
		it("should parse both mentions and links", () => {
			const text =
				"Hey @[john_doe](123), check https://example.com and tell @[jane_smith](456)";
			const result = serializeMentions(text, [], mockUsers);

			expect(result.comment).toBeDefined();
			expect(result.comment?.[0]).toEqual({ text: "Hey " });
			expect(result.comment?.[1]).toEqual({
				type: "tag",
				user: { id: 123 },
			});
			expect(result.comment?.[2]).toEqual({ text: ", check " });
			expect(result.comment?.[3]).toEqual({
				text: "https://example.com",
				attributes: { link: "https://example.com" },
			});
			expect(result.comment?.[4]).toEqual({ text: " and tell " });
			expect(result.comment?.[5]).toEqual({
				type: "tag",
				user: { id: 456 },
			});
		});
	});
});

describe("deserializeMentions", () => {
	it("should return plain text for comment without structured data", () => {
		const comment: Comment = {
			id: "1",
			taskId: "task-1",
			text: "Plain text comment",
			author: {
				id: 1,
				name: "John",
				initials: "J",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("Plain text comment");
	});

	it("should deserialize single mention", () => {
		const comment: Comment = {
			id: "2",
			taskId: "task-1",
			text: "Hey john_doe, check this",
			structuredComment: [
				{ text: "Hey " },
				{ type: "tag", user: { id: 123, username: "john_doe" } },
				{ text: ", check this" },
			],
			author: {
				id: 1,
				name: "Jane",
				initials: "J",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("Hey @[john_doe](123), check this");
	});

	it("should deserialize multiple mentions", () => {
		const comment: Comment = {
			id: "3",
			taskId: "task-1",
			text: "john_doe and jane_smith are here",
			structuredComment: [
				{ type: "tag", user: { id: 123, username: "john_doe" } },
				{ text: " and " },
				{ type: "tag", user: { id: 456, username: "jane_smith" } },
				{ text: " are here" },
			],
			author: {
				id: 1,
				name: "Test",
				initials: "T",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("@[john_doe](123) and @[jane_smith](456) are here");
	});

	it("should use fallback for mention without username", () => {
		const comment: Comment = {
			id: "4",
			taskId: "task-1",
			text: "Hey there",
			structuredComment: [
				{ text: "Hey " },
				{ type: "tag", user: { id: 789 } },
			],
			author: {
				id: 1,
				name: "Test",
				initials: "T",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("Hey @[User 789](789)");
	});

	it("should deserialize links", () => {
		const comment: Comment = {
			id: "5",
			taskId: "task-1",
			text: "Check https://example.com",
			structuredComment: [
				{ text: "Check " },
				{
					text: "https://example.com",
					attributes: { link: "https://example.com" },
				},
			],
			author: {
				id: 1,
				name: "Test",
				initials: "T",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("Check https://example.com");
	});

	it("should deserialize mentions and links together", () => {
		const comment: Comment = {
			id: "6",
			taskId: "task-1",
			text: "Hey john_doe check https://example.com",
			structuredComment: [
				{ text: "Hey " },
				{ type: "tag", user: { id: 123, username: "john_doe" } },
				{ text: " check " },
				{
					text: "https://example.com",
					attributes: { link: "https://example.com" },
				},
			],
			author: {
				id: 1,
				name: "Test",
				initials: "T",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("Hey @[john_doe](123) check https://example.com");
	});

	it("should handle empty structured comment", () => {
		const comment: Comment = {
			id: "7",
			taskId: "task-1",
			text: "Fallback text",
			structuredComment: [],
			author: {
				id: 1,
				name: "Test",
				initials: "T",
				profilePicture: "",
			},
			createdAt: "123456",
			resolved: false,
		};

		const result = deserializeMentions(comment);
		expect(result).toBe("Fallback text");
	});
});
