import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Button, ButtonGroup, Image, Input } from "@rneui/themed";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { getPersistData } from "../contexts/store";
import { uploadImage } from "../util/general-functions";
import { ScrollView } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import { get, post } from "../contexts/api";
import MyTheme from "../contexts/theme";

function ReviewScreen({ navigation }) {
  const [description, setDescription] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    getPersistData("userInfo").then(async (data) => {
      if (data && data.length > 0) {
        const { id } = data[0];
        setId(id);
        loadReview(id);
      }
    });
  }, []);

  const loadReview = async (id) => {
    const result = await get(`/profile/review/${id}`);
    setReviews(result.data.data);
  };

  const removeImage = async (uri) => {
    setImages(images.filter((img) => img !== uri));
  };

  const saveReview = async () => {
    if (!description || description === "") {
      alert("Cannot submit with review");
      return;
    }
    const data = {
      userId: id,
      images,
      createdDt: new Date(),
      description,
      stars: selectedIndex + 1,
    };
    const result = await post(`/profile/review`, data);
    if (result.data.status === "OK") {
      setImages([]);
      setDescription("");
      setLoading(false);
      setSelectedIndex(0);
      loadReview(id);
      alert("Review Posted");
    } else {
      alert("Unable to post review.");
    }
  };
  const uploadPhoto = async () => {
    const photos = await uploadImage("review", null, true, setLoading);
    if (photos && photos.length > 0) setImages(photos);
    setLoading(false);
  };

  return (
    <View style={styles.main}>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={0}
        style={styles.container}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View>
          <Feather
            name="arrow-left"
            size={30}
            style={styles.leftIcon}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Reviews</Text>
          <View>
            <ScrollView
              style={{ marginBottom: 250, paddingRight: 20 }}
              contentContainerStyle={{ flexGrow: 1 }}>
              <View>
                <ButtonGroup
                  buttonContainerStyle={{}}
                  buttons={[
                    <FontAwesome name="star" />,
                    <FontAwesome name="star" />,
                    <FontAwesome name="star" />,
                    <FontAwesome name="star" />,
                    <FontAwesome name="star" />,
                  ]}
                  containerStyle={{
                    backgroundColor: "transparent",
                  }}
                  disabledStyle={{}}
                  disabledTextStyle={{}}
                  disabledSelectedStyle={{}}
                  disabledSelectedTextStyle={{}}
                  innerBorderStyle={{
                    borderStyle: "dotted",
                  }}
                  onPress={(selectedIdx) => setSelectedIndex(selectedIdx)}
                  selectedButtonStyle={{}}
                  selectedIndex={selectedIndex}
                  selectedTextStyle={{}}
                  textStyle={{}}
                />
                <Input
                  onChange={(e) => setDescription(e.nativeEvent.text)}
                  containerStyle={{}}
                  disabledInputStyle={{ background: "#ddd" }}
                  inputContainerStyle={{}}
                  errorStyle={{}}
                  errorProps={{}}
                  inputStyle={{}}
                  multiline={true}
                  labelStyle={{}}
                  labelProps={{}}
                  // leftIcon={<Feather name='list' size={20} color={'#666'} />}
                  leftIconContainerStyle={{}}
                  rightIconContainerStyle={{}}
                  placeholder="Description"
                  label="Description"
                  value={description}
                />
                <Button onPress={uploadPhoto}>Upload Photos</Button>
                <View
                  style={{
                    minHeight: 100,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    display: "flex",
                    paddingTop: 30,
                    paddingBottom: 30,
                  }}>
                  {loading && <ActivityIndicator size="large" />}
                  {images.map((uri, i) => (
                    <View key={i} style={{ width: 100, height: 100 }}>
                      <FontAwesome
                        name="trash"
                        style={styles.trash}
                        size={20}
                        color={"red"}
                        onPress={() => removeImage(uri)}
                      />
                      <Image source={{ uri }} style={styles.image} />
                    </View>
                  ))}
                </View>
                <Button onPress={saveReview}>Post Review</Button>
              </View>
              <View style={{ display: "flex" }}>
                {reviews &&
                  reviews.map((review) => (
                    <View key={review.id} style={styles.review}>
                      <Text style={{ fontSize: 20 }}>{review.userName}</Text>
                      <Text>
                        <Star count={review.stars} />
                      </Text>
                      <Text>{review.description}</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          display: "flex",
                          paddingTop: 30,
                          paddingBottom: 30,
                          justifyContent: "space-evenly",
                        }}>
                        {review.images.map((uri, i) => (
                          <View key={i} style={{ width: 100, height: 100 }}>
                            <Image source={{ uri }} style={styles.image} />
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </View>
  );
}

const Star = ({ count }) => {
  function getStar() {
    const star = [];
    for (i = 0; i < count; i++)
      star.push(<FontAwesome key={i} name="star" size={20} />);
    return star;
  }
  return <>{getStar()}</>;
};

const styles = StyleSheet.create({
  main: {
    paddingLeft: 20,
    paddingTop: 60,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
  },
  image: {
    width: 100,
    height: 100,
  },
  review: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    borderColor: MyTheme.colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    backgroundColor: "white",
  },
});

export default ReviewScreen;
