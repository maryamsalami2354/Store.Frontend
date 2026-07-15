import BlogSection from "../../components/common/blogs/blogSection/index.js";
import VideoBlogSection from "../../components/common/blogs/videoBlogSection/index.js";

const Blogs = () => {
    return (
        <div className="container mx-auto px-6">
            <BlogSection/>
            <VideoBlogSection/>
        </div>
    )
}
export default Blogs;