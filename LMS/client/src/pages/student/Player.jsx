import React, { useContext, useEffect, useState, Fragment } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";

// Helper function to extract YouTube video ID from a URL
function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    setCourseData(course || null);
    setPlayerData(null); // Reset player when course changes
  }, [enrolledCourses, courseId]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  // YouTube player options for responsive sizing
  const youtubeOpts = {
    width: "100%",
    height: "340",
    playerVars: { autoplay: 1 },
  };

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left column: Course Structure */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold mb-4">{courseData.courseTitle}</h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`transform transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt="arrow icon"
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((Lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={assets.play_icon}
                          alt="play icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{Lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {Lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    videoId: getYouTubeVideoId(Lecture.lectureUrl),
                                    chapter: index + 1,
                                    lecture: i + 1,
                                    lectureTitle: Lecture.lectureTitle,
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Watch
                              </p>
                            )}
                            <p>
                              {humanizeDuration(
                                Lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'> Rate this Course: </h1>
            <Rating initialRating={0}/>
          </div>
        </div>

        {/* Right column: Video or Thumbnail */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] flex flex-col items-center">
          {playerData && playerData.videoId ? (
            <Fragment>
              <div className="w-full aspect-video">
                <YouTube
                  videoId={playerData.videoId}
                  opts={youtubeOpts}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              </div>
              <div className="flex justify-between items-center w-full px-2 mt-2">
                <span className="text-sm text-gray-800">
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </span>
                <button className="text-blue-600 text-sm font-medium cursor-pointer">
                  Mark Complete
                </button>
              </div>
            </Fragment>
          ) : (
            <img src={courseData.courseThumbnail} alt="" className="w-full" />
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Player;