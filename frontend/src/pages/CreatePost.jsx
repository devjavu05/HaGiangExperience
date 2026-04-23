import CreateExperienceForm from "./CreateExperienceForm";

function CreatePost({ onSuccess, showToast }) {
  return <CreateExperienceForm mode="create" onSuccess={onSuccess} showToast={showToast} />;
}

export default CreatePost;
