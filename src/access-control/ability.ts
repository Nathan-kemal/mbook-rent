import {
  AbilityBuilder,
  createMongoAbility,
  PureAbility,
  MongoQuery,
} from "@casl/ability";

type User = {
  role: "Admin" | "Owner" | null;
  id: string;
};

type CrudActions =
  | "manage"
  | "read"
  | "create"
  | "view"
  | "create"
  | "update"
  | "delete"
  | "viewRevenue"
  | "approve"
  | "disable"
  | "filter"
  | "statistics";

type Ability =
  | [CrudActions, "Book"]
  | [CrudActions, "User"]
  | [CrudActions, "Revenue"]
  | [CrudActions, "Uploaded"]
  | [CrudActions, "Owner"];

export type AppAbility = PureAbility<Ability, MongoQuery>;

export function defineAbilityFor(user: User) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user.role === "Admin") {
    can("view", "User");
    can("approve", "User");
    can("disable", "User");
    can("view", "Book");
    can("view", "Owner");
    can("filter", "Owner");
    can("approve", "Book");
    can("filter", "Book");
    can("statistics", "Book");
  }
  if (user.role === "Owner") {
    const ownerCondition = { ownerId: user.id };

    can("update", "Book");
    can("manage", "Book", ownerCondition);
    can("delete", "Book");
    can("view", "Book");
    can("viewRevenue", "Revenue");
  }

  return build();
}
