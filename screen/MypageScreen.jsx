import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeechBubble from '../components-common/SpeechBubble';
import { getInfo, updateInfo, saveActivityArea, deleteActivityArea } from "../api/authApi";
import RNPickerSelect from "react-native-picker-select";

const MyPage = ({ navigation }) => {
    const [modify, setModify] = useState(false);
    const [riderNickname, setRiderNickname] = useState('');
    const [riderEmail, setRiderEmail] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const [riderAccount, setRiderAccount] = useState('');
    const [riderTransportation, setRiderTransportation] = useState('');
    const [activityAreas, setActivityAreas] = useState([]);
    const [newActivityArea, setNewActivityArea] = useState('');

    useEffect(() => {
        const fetchRiderInfo = async () => {
            try {
                const res = await getInfo();
                if (res.status === 200) {
                    const {
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
            setModify(false);
        } else {
            setModify(true);
        }
    };

    const handleAddActivityArea = () => {
        if (newActivityArea.trim() !== '') {
            setActivityAreas([...activityAreas, newActivityArea.trim()]);
            setNewActivityArea('');
        }
    };

    const handleRemoveActivityArea = (index) => {
        setActivityAreas(activityAreas.filter((_, i) => i !== index));
    };

    const handleSaveActivityAreas = async () => {
        try {
            // Delete all existing activity areas first
            const deletePromises = activityAreas.map(area => deleteActivityArea({ riderActivityArea: area }));
            const deleteResults = await Promise.all(deletePromises);

            // Check if all deletions were successful
            const allDeleted = deleteResults.every(res => res.status === 200);

            if (allDeleted) {
                // Save new activity areas
                const savePromises = activityAreas.map(area => saveActivityArea({ riderActivityArea: area }));
                const saveResults = await Promise.all(savePromises);

                // Check if all saves were successful
                const allSaved = saveResults.every(res => res.status === 200);

                if (allSaved) {
                    Alert.alert('활동 지역 저장', '활동 지역이 저장되었습니다.');
                } else {
                    Alert.alert('Error', '활동 지역 저장 중 에러가 발생했습니다.');
                }
            } else {
                Alert.alert('Error', '활동 지역 삭제 중 에러가 발생했습니다.');
            }
        } catch (error) {
            console.log("활동 지역 처리 중 에러", error);
            Alert.alert('Error', '활동 지역 처리 중 에러가 발생했습니다.');
        }
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
                {modify && (
                    <View style={styles.buttonContainer}>
                        <View style={styles.activityContainer}>
                            <TextInput
                                style={[styles.activityInput, { flex: 6 }]}
                                placeholder="새 활동 지역"
                                value={newActivityArea}
                                onChangeText={setNewActivityArea}
                            />
                            <TouchableOpacity onPress={handleAddActivityArea} style={[styles.activityButton, { flex: 2 }]}>
                                <SpeechBubble
                                    content="+"
                                    backgroundColor="#ffffff"
                                    textColor="#634F4F"
                                    height={50}
                                    width="100%"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <View style={styles.activityAreaContainer}>
                    <Text style={styles.label}>활동 지역</Text>
                    {activityAreas.map((area, index) => (
                        <View key={index} style={styles.activityItem}>
                            <Text style={styles.value}>{area}</Text>
                            {modify && (
                                <TouchableOpacity onPress={() => handleRemoveActivityArea(index)}>
                                    <Text style={styles.removeButton}>삭제</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    {modify && (
                        <TouchableOpacity onPress={handleSaveActivityAreas}>
                            <SpeechBubble
                                content="활동 지역 저장"
                                backgroundColor="#ffffff"
                                textColor="black"
                                height={50}
                                width="100%"
                            />
                        </TouchableOpacity>
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
    activityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    activityInput: {
        height: 40,
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginRight: 10,
    },
    activityButton: {
        marginLeft: 10,
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
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    removeButton: {
        color: 'red',
        fontWeight: 'bold',
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
