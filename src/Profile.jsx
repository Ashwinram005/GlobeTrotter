import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "./AuthContext";
import { supabase } from "./lib/supabase";
import {
    MapPin,
    Globe,
    Calendar,
    Edit,
    Check,
    Briefcase,
    Loader2,
    Plane,
    Heart,
    Camera
} from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';

// --- CUSTOM VISUAL COMPONENTS ---

const FrameworkGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden h-full">
        {/* Vertical Lines */}
        <div className="w-px bg-white/10 absolute left-[40px] hidden md:block h-full" />
        <div className="w-px bg-white/10 absolute right-[40px] hidden lg:block h-full" />

        {/* Horizontal Lines */}
        <div className="absolute top-[180px] left-0 w-full h-px bg-white/10" />
        <div className="absolute bottom-[20px] left-0 w-full h-px bg-white/10" />
    </div>
);

const DrawVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: "easeInOut" }
    }
};

const HandDrawnCrown = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C2E812" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-12">
        <motion.path
            d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"
            variants={DrawVariant} initial="hidden" animate="visible"
        />
    </svg>
);

const MessyUnderline = () => (
    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,5 Q50,10 100,5" stroke="#C2E812" strokeWidth="3" fill="none" />
    </svg>
);

const PaperRocket = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12L22 2L15 22L11 13L2 12Z" fill="#FF5018" stroke="#FF5018" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />
    </svg>
);

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const [formData, setFormData] = useState({});
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile(data);
                setFormData(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from("profiles")
                .update(formData)
                .eq("id", user.id);

            if (error) throw error;
            setProfile(formData);
            setIsEditing(false);
            toast.success("Profile updated!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#0061FE]" />
            </div>
        );
    }

    const displayName = formData.full_name || user?.email?.split("@")[0] || "Traveler";
    const displayLocation = formData.location || "Earth";
    const avatarInitial = (displayName[0] || "U").toUpperCase();
    const joinedYear = new Date(user?.created_at).getFullYear();

    const tabs = ["Overview", "My Trips", "Wishlist"];

    const personalInfo = [
        { label: "Username", value: formData.username, name: "username" },
        { label: "Location", value: formData.location, name: "location" },
        { label: "Website", value: formData.website, name: "website" },
    ];

    return (
        <div className="min-h-screen bg-[#F7F5F2] font-sans text-[#1E1E1E] selection:bg-[#C2E812] selection:text-black relative overflow-x-hidden">
            <Navbar />
            <Toaster position="bottom-right" />

            {/* --- HEADER SECTION (Dark) --- */}
            <div className="bg-[#1E1E1E] text-white pt-24 pb-32 px-6 relative overflow-visible">
                <FrameworkGrid />

                {/* Doodles */}
                <div className="absolute top-10 right-10 opacity-80 animate-pulse">
                    <HandDrawnCrown />
                </div>

                {/* Animated Paper Rocket */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                    <motion.div
                        initial={{ x: "-10vw", y: 100, rotate: 45 }}
                        animate={{
                            x: "110vw",
                            y: [100, 50, 120, -20],
                            rotate: [45, 35, 50, 25]
                        }}
                        transition={{
                            duration: 20, repeat: Infinity, ease: "linear", delay: 1
                        }}
                        className="absolute top-10"
                    >
                        <PaperRocket className="w-16 h-16 drop-shadow-lg" />
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    {/* Left: Profile Info */}
                    <div className="flex-1 w-full md:max-w-2xl">
                        <div className="mb-6">
                            {isEditing ? (
                                <input
                                    name="full_name"
                                    value={formData.full_name || ''}
                                    onChange={handleInputChange}
                                    className="bg-transparent border-b-2 border-[#0061FE] text-4xl md:text-6xl font-black text-white focus:outline-none w-full mb-2 placeholder-white/50"
                                    placeholder="Your Name"
                                />
                            ) : (
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 relative inline-block">
                                    {displayName}
                                    <MessyUnderline />
                                </h1>
                            )}
                            <p className="text-[#0061FE] font-mono text-lg">@{formData.username || 'username'}</p>
                        </div>

                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio || ''}
                                onChange={handleInputChange}
                                className="w-full bg-white/10 text-white p-3 rounded border border-white/20 focus:border-[#C2E812] outline-none mb-6"
                                rows="3"
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p className="text-xl text-gray-300 leading-relaxed mb-6 max-w-xl">
                                {formData.bio || "No bio available yet."}
                            </p>
                        )}

                        {/* Meta Data Row */}
                        <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#C2E812]" />
                                {isEditing ? (
                                    <input
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleInputChange}
                                        className="bg-transparent border-b border-gray-500 text-white w-32 outline-none"
                                        placeholder="Location"
                                    />
                                ) : (displayLocation)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#FF5018]" />
                                Member since {joinedYear}
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Actions */}
                    <div className="flex flex-col items-end gap-6">
                        <div className="flex gap-8 text-center text-white">
                            <div>
                                <div className="text-3xl font-black">0</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Trips</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black">0</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Countries</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black">0</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Photos</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white text-[#1E1E1E] px-6 py-3 font-bold rounded-xl hover:bg-[#C2E812] transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setIsCopied(true);
                                            setTimeout(() => setIsCopied(false), 2000);
                                        }}
                                        className={`p-3 border-2 border-white/20 rounded-xl transition-colors ${isCopied ? "bg-[#C2E812] text-black border-[#C2E812]" : "hover:bg-white/10 text-white"}`}
                                        title="Copy Profile Link"
                                    >
                                        {isCopied ? <Check className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleSave} className="bg-[#C2E812] text-black px-6 py-3 font-bold rounded-xl hover:bg-[#aacc00]">Save</button>
                                    <button onClick={handleCancel} className="bg-white/10 text-white px-6 py-3 font-bold rounded-xl border border-white/20">Cancel</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- OVERLAPPING AVATAR & CONTENT (Light) --- */}
            <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-20 mb-20 bg-transparent pointer-events-none">
                {/*  pointer-events-none on wrapper so it doesnt block clicks on background if using negative margins carefully, 
                      but actually we want content to be clickable. Lets keeping it simple div.
                 */}
                <div className="pointer-events-auto">
                    {/* Avatar */}
                    <div className="relative inline-block mb-12">
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-[#1E1E1E] rounded-full border-[6px] border-[#F7F5F2] overflow-hidden shadow-2xl relative z-10">
                            {formData.avatar_url ? (
                                <img
                                    src={formData.avatar_url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-[#FF5018] text-white">
                                    {avatarInitial}
                                </div>
                            )}
                        </div>
                        {/* Edit Avatar Overlay */}
                        {isEditing && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-full cursor-pointer group">
                                <Camera className="text-white w-8 h-8 opacity-75 group-hover:opacity-100" />
                                <input
                                    type="text"
                                    name="avatar_url"
                                    value={formData.avatar_url || ''}
                                    onChange={handleInputChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer text-xs"
                                    title="Paste Image URL here for now"
                                />
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-[#0061FE] text-white p-2 rounded-full border-4 border-[#F7F5F2] z-30">
                            <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 mb-8 border-b-2 border-[#1E1E1E]/10">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-lg font-bold tracking-tight transition-all ${activeTab === tab
                                    ? "text-[#1E1E1E] border-b-4 border-[#FF5018]"
                                    : "text-gray-400 hover:text-[#1E1E1E]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Grid Content */}
                    <div className="grid grid-cols-1 gap-8">
                        {activeTab === 'Overview' && (
                            <div className="space-y-8">
                                {/* Personal Details Card */}
                                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-black text-[#1E1E1E] mb-6">Personal Details</h3>
                                    <div className="space-y-4">
                                        {personalInfo.map((info, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-50 last:border-0">
                                                <span className="font-bold text-gray-500 mb-1 sm:mb-0">{info.label}</span>
                                                {isEditing ? (
                                                    <input
                                                        name={info.name}
                                                        value={info.value || ''}
                                                        onChange={handleInputChange}
                                                        className="bg-[#F7F5F2] border-none rounded-lg px-3 py-2 font-bold text-[#1E1E1E] focus:ring-2 focus:ring-[#0061FE] w-full sm:w-auto outline-none text-right"
                                                    />
                                                ) : (
                                                    <span className="font-bold text-[#1E1E1E] sm:text-right">{info.value || "Not set"}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'My Trips' && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Plane className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">No trips planned yet</h3>
                                <Link to="/create-trip" className="text-[#0061FE] font-bold hover:underline mt-2 inline-block">Start planning</Link>
                            </div>
                        )}

                        {activeTab === 'Wishlist' && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">Your wishlist is empty</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
