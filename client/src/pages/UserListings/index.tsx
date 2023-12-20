import ListingsContent from "./UserListingsContent";

const UserListings = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Your Listings</h1>
      <ListingsContent />
    </main>
  );
};

export default UserListings;
