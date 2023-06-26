import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';

 
// const photos = [
//     {
//       src: 'http://example.com/example/img1.jpg',
//       width: 4,
//       height: 3
//     },
//     {
//       src: 'http://example.com/example/img2.jpg',
//       width: 1,
//       height: 1
//     }
// ];

const ImageGallery = ({photos}) => {
    //state
    const [current, setCurrent] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    //params
    const params = useParams();

    console.log(params);

    //open light box
    const openLightBox = useCallback((event, {photo, index}) => {
        setCurrent(index);
        setIsOpen(true);
    }, []);

    // close light box
    const closeLightBox = () => {
        setCurrent(0);
        setIsOpen(false);
    }

    return ( 
    <>
    <Gallery photos={photos} onClick={openLightBox}/>;
    <ModalGateway>
        {isOpen ? (
            <Modal onClose={closeLightBox}>
                <Carousel 
                width="400"
                currentIndex={current} 
                views={photos.map((x) => (
                {...x ,
                srcset: x.srcSet ,
                caption: x.title }))} />
            </Modal>
        ) : null }
    </ModalGateway>
    </> );
}
 
export default ImageGallery;