import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";

const Slider: any = () => {
  const getslider = useSelector((state: any) => state.getslider).data;
  return (
    <>
      <div className="border_bottom_strip">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
          slidesPerView={1}
        >
          {getslider.map((item: any, index: any) => {
            return (
              <SwiperSlide key={index}>
                <img src={item.bannerURL} alt={item.title} />
                <p>{item.title}</p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default Slider;
