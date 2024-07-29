import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeechBubble from '../components-common/SpeechBubble';
import { getInfo, updateInfo } from "../api/authApi";
import RNPickerSelect from "react-native-picker-select";

const MyPage = ({ navigation }) => {
    const [modify, setModify] = useState(false);
    const [riderNickname, setRiderNickname] = useState('');
    const [riderEmail, setRiderEmail] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const [riderAccount, setRiderAccount] = useState('');
    const [riderTransportation, setRiderTransportation] = useState('');
    const [activityAreas, setActivityAreas] = useState([]);

    useEffect(() => {
        const fetchRiderInfo = async () => {
            try {
                const res = await getInfo();
                if (res.status === 200) {
                    const {
                        riderId,
                        riderNickname,
                        riderEmail,
                        riderPhone,
                        riderAccount,
                        riderTransportation
                    } = res.data.rider;

                    const areas = res.data.activityAreas.map(area => area.riderActivityArea);

                    setRiderNickname(riderNickname || '');
                    setRiderEmail(riderEmail || '');
                    setRiderPhone(riderPhone || '');
                    setRiderAccount(riderAccount || '');
                    setRiderTransportation(riderTransportation || '');
                    setActivityAreas(areas);
                }
            } catch (error) {
                console.log("사용자 정보 불러오는 중 에러", error);
                Alert.alert("Error", "사용자 정보를 불러오는 중 에러가 발생했습니다.");
            }
        };
        fetchRiderInfo();
    }, []);

    const handleModify = async () => {
        if (modify) {
            try {
                await AsyncStorage.setItem('riderNickname', riderNickname);
                await AsyncStorage.setItem('riderPhone', riderPhone);
                try {
                    const res = await updateInfo({
                        riderNickname,
                        riderPhone,
                        riderAccount,
                        riderTransportation
                    });
                    if (res.status === 200) {
                        Alert.alert('정보 수정 성공', '정보 수정이 완료되었습니다!');
                        // navigation.replace('Main'); // Uncomment if you want to navigate after successful update
                    } else {
                        Alert.alert('정보 수정 실패', '정보 수정에 실패했습니다. 다시 시도해주세요.');
                    }
                } catch (error) {
                    console.log("정보 수정 중 에러", error);
                    Alert.alert('Error', '정보 수정 중 에러가 발생했습니다.');
                }
            } catch (error) {
                console.error('Failed to save user data:', error);
            }
            setModify(false); // Exit edit mode
        } else {
            setModify(true); // Enter edit mode
        }
    };

    const handleAddActivityArea = () => {
        // Functionality to add a new activity area
        Alert.alert("추가 기능", "활동 지역 추가 기능은 아직 구현되지 않았습니다.");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.menu} onPress={() => navigation.openDrawer()}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>
            <View style={styles.profileContainer}>
                <View style={styles.profile}>
                    <Image
                        source={require('../assets/베스트개발자.png')}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.greeting}>배달왕! {riderNickname}</Text>
                </View>
                <View style={styles.infoBox}>
                    {modify ? (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>닉네임</Text>
                                <TextInput
                                    style={styles.input}
                                    value={riderNickname}
                                    onChangeText={setRiderNickname}
                                    textAlign="right"
                                />
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>계좌번호</Text>
                                <TextInput
                                    style={styles.input}
                                    value={riderAccount}
                                    onChangeText={setRiderAccount}
                                    textAlign="right"
                                />
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>배달수단</Text>
                                <RNPickerSelect
                                    onValueChange={(value) => setRiderTransportation(value)}
                                    items={[
                                        { label: 'Walk', value: 'WALK' },
                                        { label: 'Bicycle', value: 'BICYCLE' },
                                        { label: 'Motorbike', value: 'MOTORBIKE' },
                                        { label: 'Car', value: 'CAR' },
                                    ]}
                                    style={pickerStyles}
                                    placeholder={{ label: '배달 수단 선택...', value: null }}
                                    value={riderTransportation}
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>이메일</Text>
                                <Text style={styles.value}>{riderEmail}</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>전화번호</Text>
                                <Text style={styles.value}>{riderPhone}</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>계좌번호</Text>
                                <Text style={styles.value}>{riderAccount}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>배달수단</Text>
                                <Text style={styles.value}>{riderTransportation}</Text>
                            </View>
                        </>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleModify}>
                        <SpeechBubble
                            content={modify ? "저장하기" : "수정하기"}
                            backgroundColor="#ffffff"
                            textColor="black"
                            height={50}
                            width="100%"
                        />
                    </TouchableOpacity>
                </View>
                {modify && (
                    <View style={styles.buttonContainer}>
                        <Button title="활동 지역 추가" onPress={handleAddActivityArea} />
                    </View>
                )}
                <View style={styles.activityAreaContainer}>
                    <Text style={styles.label}>활동 지역</Text>
                    {activityAreas.map((area, index) => (
                        <Text key={index} style={styles.value}>{area}</Text>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity>
                        <SpeechBubble
                            content="로그아웃"
                            backgroundColor="#ffffff"
                            textColor="black"
                            height={50}
                            width="100%"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 0,
        paddingTop: 80,
    },
    profile: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    infoBox: {
        width: '100%',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#555555',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10,
    },
    value: {
        fontSize: 16,
    },
    input: {
        flex: 1,
        fontSize: 18,
        borderColor: '#ddd',
        borderBottomWidth: 1,
    },
    separator: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'black',
        marginVertical: 5,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 10,
    },
    menu: {
        position: "absolute",
        top: 40,
        left: 20,
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: "#94D35C",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    menuText: {
        fontSize: 30,
        color: "#ffffff",
    },
    activityAreaContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#555555',
        marginBottom: 20,
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
    inputAndroid: {
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
});

export default MyPage;
