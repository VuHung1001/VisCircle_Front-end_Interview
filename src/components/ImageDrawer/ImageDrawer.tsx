import React, { useCallback, useMemo, useRef, useContext, memo } from "react";
import { Context } from "../../contexts/Context";
import { ImageObject } from "../../types/types";
import styles from "./ImageDrawer.module.css";

interface Props {
    data: ImageObject[];
    selectedCategory: string;
    imageList: ImageObject[];
}

const ImageDrawer: React.FC<Props> = ({
    data,
    selectedCategory,
    imageList,
}) => {
    const { setSelectedImage, setSelectedCategory, setImageList } = useContext(Context);
    const delayTimeRef = useRef<number>(0);
    const title = useMemo<string>(() => {
        return selectedCategory
            .concat("s")
            .replace(selectedCategory[0], selectedCategory[0].toUpperCase());
    }, [selectedCategory]);

    const selectImage = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>): void => {
            const target = event.target as HTMLButtonElement;
            const currentSelectedImage = document.querySelector(
                "." + styles.selectedImage
            );

            if (currentSelectedImage) {
                currentSelectedImage.className = styles.categoryItem;
            }
            target.className = styles.selectedImage;

            if (target.dataset?.image) {
                const imageId = target.dataset.image;
                for (const image of imageList) {
                    if (image.id === imageId) {
                        setSelectedImage(image);
                        break;
                    }
                }
            }
        },
        [setSelectedImage, imageList]
    );
    // console.log(imageList)

    const handleSearchImage = useCallback(
        (event: React.FormEvent<HTMLInputElement>): void => {
            const target = event.target as HTMLInputElement;

            window.clearTimeout(delayTimeRef.current);
            delayTimeRef.current = window.setTimeout(() => {
                if (target.value) {
                    const searchedImageList = [];
                    const text = target.value.toLowerCase();
                    let areSameCategory = false;

                    for (const image of data) {
                        const name = image.name.toLowerCase();
                        const description = image.description.toLowerCase();

                        if (
                            name.includes(text) ||
                            text.includes(name) ||
                            description.includes(text) ||
                            text.includes(description)
                        ) {
                            searchedImageList.push(image);
                            if (image.category === selectedCategory) {
                                areSameCategory = true;
                            }
                        }
                    }

                    setImageList(searchedImageList);
                    if (!areSameCategory && searchedImageList.length) {
                        setSelectedCategory(searchedImageList[0].category);
                    }
                } else {
                    setImageList([...data]);
                }
            }, 800);
        },
        [data, selectedCategory]
    );

    return (
        <div className={styles.imageDrawer}>
            <div className={styles.header}>
                <span>{title}</span>
            </div>
            <div className={styles.search}>
                <div className={styles.searchInput}>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Search for Photo..."
                        onInput={handleSearchImage}
                    ></input>
                    <label htmlFor="search-input">
                        <img src="Search.svg"></img>
                    </label>
                </div>
            </div>
            <div className={styles.category}>
                {imageList.length ? (
                    imageList.map((image, index) => {
                        if (image.category === selectedCategory)
                            return (
                                <button
                                    className={styles.categoryItem}
                                    style={{
                                        backgroundImage: `url(${image.metadata[0].value})`,
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        backgroundColor: "#CFDAE2",
                                    }}
                                    key={index}
                                    data-image={image.id}
                                    onClick={selectImage}
                                ></button>
                            );
                    })
                ) : (
                    <button className={styles.categoryItem}></button>
                )}
            </div>
        </div>
    );
};

export default memo(ImageDrawer);