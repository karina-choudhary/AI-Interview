import React, { useState, useEffect } from "react";
import axios from "axios";


function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    // 👇 YAHAN AAPKA IMAGE LINK DAL DIYA HAI (Aap is link ko badal bhi sakte hain)
    profileImage: "https://unsplash.com",
    bio: "",
    skills: "",
    experience: "",
    education: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "https://ai-interview-a2kn.onrender.com/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProfile({
        name: response.data.user.name,
        email: response.data.user.email,
        profileImage: response.data.user.profileImage || "https://unsplash.com", // 👈 Fallback link agar database khali ho
        bio: response.data.user.bio || "",
        skills: response.data.user.skills ? response.data.user.skills.join(", ") : "",
        experience: response.data.user.experience || "",
        education: response.data.user.education || "",
      });
    } catch (error) {
      console.log(error);
      setMessage("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update Profile
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        "https://ai-interview-a2kn.onrender.com/api/user/profile",
        {
          profileImage: profile.profileImage,
          bio: profile.bio,
          skills: profile.skills
            ? profile.skills.split(",").map((skill) => skill.trim())
            : [],
          experience: profile.experience,
          education: profile.education,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(response.data.message);
      fetchProfile();
    } catch (error) {
      console.log(error);
      setMessage("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <h2 className="profile-title">
          👤 My Profile
        </h2>

        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        {profile.profileImage && (
          <div className="profile-image-wrapper">

            <img
              src={profile.profileImage}
              alt="Profile"
              className="profile-image"
            />

          </div>
        )}

        {/* Read Only */}

        <div className="profile-group">

          <label className="profile-label">
            Name
          </label>

          <input
            className="profile-input"
            value={profile.name}
            readOnly
          />

        </div>

        <div className="profile-group">

          <label className="profile-label">
            Email
          </label>

          <input
            className="profile-input"
            value={profile.email}
            readOnly
          />

        </div>

        {/* Editable */}

        <div className="profile-group">

          <label className="profile-label">
            Profile Image URL
          </label>

          <input
            className="profile-input"
            value={profile.profileImage}
            onChange={(e) =>
              setProfile({
                ...profile,
                profileImage: e.target.value,
              })
            }
          />

        </div>

        <div className="profile-group">

          <label className="profile-label">
            Bio
          </label>

          <textarea
            className="profile-textarea"
            rows="4"
            value={profile.bio}
            onChange={(e) =>
              setProfile({
                ...profile,
                bio: e.target.value,
              })
            }
          />

        </div>

        <div className="profile-group">

          <label className="profile-label">
            Skills
          </label>

          <input
            className="profile-input"
            placeholder="React, Node, Express..."
            value={profile.skills}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: e.target.value,
              })
            }
          />

        </div>

        <div className="profile-group">

          <label className="profile-label">
            Experience
          </label>

          <textarea
            className="profile-textarea"
            rows="4"
            value={profile.experience}
            onChange={(e) =>
              setProfile({
                ...profile,
                experience: e.target.value,
              })
            }
          />

        </div>
       
       <div className="profile-group">

          <label className="profile-label">
            Education
          </label>

          <input
            className="profile-input"
            value={profile.education}
            onChange={(e) =>
              setProfile({
                ...profile,
                education: e.target.value,
              })
            }
          />

        </div>

        <button
          className="profile-btn"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>

      </div>

    </div>
  );
}

export default Profile;
