import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Types
  type EventCategory = {
    id : Nat;
    name : Text;
    description : Text;
    order : Nat;
  };

  module EventCategory {
    public func compareByOrder(category1 : EventCategory, category2 : EventCategory) : Order.Order {
      Nat.compare(category1.order, category2.order);
    }
  };

  type EventImage = {
    id : Nat;
    categoryId : Nat;
    blobId : Text;
    caption : Text;
    uploadedAt : Int;
  };

  // Categories
  var nextCategoryId = 1;
  let categories = Map.empty<Nat, EventCategory>();

  // Images
  var nextImageId = 1;
  let images = Map.empty<Nat, EventImage>();

  // Init default categories
  system func preupgrade() {
    let initialCategories = [
      { id = 1; name = "Reception"; description = ""; order = 1 },
      { id = 2; name = "Reception 1"; description = ""; order = 2 },
      { id = 3; name = "Mantapa"; description = ""; order = 3 },
      { id = 4; name = "Door Decoration"; description = ""; order = 4 },
      { id = 5; name = "Name Board"; description = ""; order = 5 },
      { id = 6; name = "Ramp Decoration"; description = ""; order = 6 },
      { id = 7; name = "Jade"; description = ""; order = 7 },
      { id = 8; name = "Hara"; description = ""; order = 8 },
      { id = 9; name = "Chapra Decoration"; description = ""; order = 9 },
      { id = 10; name = "Naming Ceremony"; description = ""; order = 10 },
    ];

    let categoryIter = initialCategories.values();
    categoryIter.forEach(
      func(cat) {
        categories.add(cat.id, cat);
        nextCategoryId += 1;
      }
    );
  };

  // User Profile APIs
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public APIs (no authorization required)
  public query func getCategories() : async [EventCategory] {
    categories.values().toArray().sort(EventCategory.compareByOrder);
  };

  public query func getImagesByCategory(categoryId : Nat) : async [EventImage] {
    images.values().toArray().filter(
      func(img) { img.categoryId == categoryId }
    );
  };

  public query func getAllImages() : async [EventImage] {
    images.values().toArray();
  };

  // Admin-only APIs
  public shared ({ caller }) func addImage(categoryId : Nat, blobId : Text, caption : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not categories.containsKey(categoryId)) {
      Runtime.trap("Category does not exist");
    };

    let newImage : EventImage = {
      id = nextImageId;
      categoryId;
      blobId;
      caption;
      uploadedAt = Time.now();
    };

    images.add(nextImageId, newImage);
    nextImageId += 1;
    newImage.id;
  };

  public shared ({ caller }) func removeImage(imageId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (images.get(imageId)) {
      case (null) { false };
      case (?_) {
        images.remove(imageId);
        true;
      };
    };
  };

  public shared ({ caller }) func updateCategoryDescription(categoryId : Nat, description : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (categories.get(categoryId)) {
      case (null) { false };
      case (?category) {
        let updatedCategory : EventCategory = {
          id = category.id;
          name = category.name;
          description;
          order = category.order;
        };
        categories.add(categoryId, updatedCategory);
        true;
      };
    };
  };

  public query ({ caller }) func checkAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
