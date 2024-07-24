import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import SpeechBubble from '../components-common/SpeechBubble';
import { getInfo, saveActivityArea, updateInfo } from "../api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from 'react-native-picker-select';

const SignupScreen = ({ navigation }) => {
    const [rider, setRider] = useState(null);
    const [riderActivityAreas, setRiderActivityAreas] = useState([]);

    useEffect(() => {
        const fetchRiderInfo = async () => {
            try {
                const res = await getInfo();
                if (res.status === 200) {
                    const { rider, activityAreas } = res.data;

                    if (!rider.riderAccount) {
                        // If riderAccount is null, set rider details for signing up
                        setRider({
                            riderId: rider.riderId,
                            riderEmail: rider.riderEmail,
                            riderNickname: rider.riderNickname,
                            riderPhone: rider.riderPhone,
                            riderTransportation: rider.riderTransportation,
                            riderAccount: rider.riderAccount,
                            riderActivate: rider.riderActivate,
                            riderIsDeleted: rider.riderIsDeleted
                        });
                        setRiderActivityAreas(activityAreas.map(area => area.riderActivityArea));
                    } else {
                        // If riderAccount is not null, navigate to the main screen
                        navigation.replace('Main');
                        await AsyncStorage.setItem('riderId', JSON.stringify(rider.riderId));
                        await AsyncStorage.setItem('riderNickname', rider.riderNickname);
                        await AsyncStorage.setItem('riderEmail', rider.riderEmail);
                        await AsyncStorage.setItem('riderAccount', rider.riderAccount);
                        await AsyncStorage.setItem('riderPhone', rider.riderPhone);
                        await AsyncStorage.setItem('riderTransportation', rider.riderTransportation);
                    }
                }
            } catch (error) {
                console.log("사용자 정보 불러오는 중 에러", error);
                Alert.alert("Error", "사용자 정보를 불러오는 중 에러가 발생했습니다.");
            }
        };
        fetchRiderInfo();
    }, []);

    const saveArea = async () => {
        try {
            const nonEmptyAreas = riderActivityAreas.filter(area => area.trim() !== '');

            if (nonEmptyAreas.length === 0) {
                console.log("저장할 활동 지역이 없습니다.");
                return;
            }

            const dataToSave = nonEmptyAreas.map(area => ({
                riderId: rider.riderId,
                riderActivityArea: area
            }));

            for (const data of dataToSave) {
                const res = await saveActivityArea(data);
                if (res.status !== 200) {
                    Alert.alert('배달 지역 저장 실패', '배달 지역 저장에 실패했습니다. 다시 시도해주세요.');
                    return;
                }
            }

            console.log("모든 활동 지역이 성공적으로 저장되었습니다.");
        } catch (error) {
            console.log("배달 지역 저장 중 에러", error);
            Alert.alert('Error', '배달 지역 저장 중 에러가 발생했습니다.');
        }
    };

    const handleSignup = async () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{11}$/;

        if (!emailPattern.test(rider.riderEmail)) {
            Alert.alert('유효하지 않은 이메일', '올바른 이메일 형식이 아닙니다!');
            return;
        }
        if (!rider.riderEmail || !rider.riderNickname || !rider.riderPhone || riderActivityAreas.some(area => !area.trim())) {
            Alert.alert('빈 칸 오류', '빈 칸 없이 모두 입력해주세요!');
            return;
        }
        if (!phonePattern.test(rider.riderPhone)) {
            Alert.alert('유효하지 않은 전화번호', '전화번호는 11자리 숫자로 입력해주세요!');
            return;
        }

        try {
            await saveArea();

            const res = await updateInfo({
                riderId: rider.riderId,
                riderNickname: rider.riderNickname,
                riderPhone: rider.riderPhone,
                riderTransportation: rider.riderTransportation,
                riderAccount: rider.riderAccount,
                riderActivate: true,
                riderIsDeleted: false
            });

            if (res.status === 200) {
                Alert.alert('회원가입 성공', '회원가입이 완료되었습니다!');
                navigation.replace('Main');
            } else {
                Alert.alert('회원가입 실패', '회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.log("회원가입 중 에러", error);
            Alert.alert('Error', '회원가입 중 에러가 발생했습니다.');
        }
    };

    const handleAddArea = () => {
        if (riderActivityAreas.length < 3) {
            setRiderActivityAreas([...riderActivityAreas, '']);
        }
    };

    const handleRemoveArea = (index) => {
        if (riderActivityAreas.length > 1) {
            setRiderActivityAreas(riderActivityAreas.filter((_, i) => i !== index));
        }
    };

    const handleActivityAreaChange = (text, index) => {
        const newAreas = [...riderActivityAreas];
        newAreas[index] = text;
        setRiderActivityAreas(newAreas);
    };

    return (
        <ScrollView>
            <View>
                <View style={styles.container}>
                    <Image
                        source={require('../assets/배달기사.png')} // 첫 번째 이미지 경로
                        style={styles.iconImage}
                    />
                    <Image
                        source={require('../assets/waguwagu.png')} // 두 번째 이미지 경로
                        style={styles.logoImage}
                        resizeMode="contain" // 이미지가 버튼에 맞게 조정되도록 설정
                    />
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>이메일</Text>
                    <TextInput
                        style={[styles.input, rider && styles.disabledInput]}
                        placeholder="Email"
                        value={rider?.riderEmail || ''}
                        onChangeText={(text) => setRider({ ...rider, riderEmail: text })}
                        editable={false}
                    />
                    <Text style={styles.infoText}>닉네임</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nickname"
                        value={rider?.riderNickname || ''}
                        onChangeText={(text) => setRider({ ...rider, riderNickname: text })}
                    />
                    <Text style={styles.infoText}>전화번호</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        value={rider?.riderPhone || ''}
                        onChangeText={(text) => setRider({ ...rider, riderPhone: text })}
                        keyboardType="numeric"
                    />
                    <Text style={styles.infoText}>활동지역</Text>
                    {riderActivityAreas.map((area, index) => (
                        <View key={index} style={styles.activityContainer}>
                            <TextInput
                                style={styles.activityInput}
                                placeholder={`Activity Area ${index + 1}`}
                                value={area}
                                onChangeText={(text) => handleActivityAreaChange(text, index)}
                            />
                            {riderActivityAreas.length > 1 && (
                                <TouchableOpacity onPress={() => handleRemoveArea(index)} style={styles.activityButton}>
                                    <SpeechBubble
                                        content="-"
                                        backgroundColor="#ffffff"
                                        textColor="#634F4F"
                                        height={50}
                                        width="100%"
                                    />
                                </TouchableOpacity>
                            )}
                            {riderActivityAreas.length < 3 && (
                                <TouchableOpacity onPress={handleAddArea} style={styles.activityButton}>
                                    <SpeechBubble
                                        content="+"
                                        backgroundColor="#ffffff"
                                        textColor="#634F4F"
                                        height={50}
                                        width="100%"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    <Text style={styles.infoText}>계좌번호</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Account"
                        value={rider?.riderAccount || ''}
                        onChangeText={(text) => setRider({ ...rider, riderAccount: text })}
                    />
                    <Text style={styles.infoText}>배달수단</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setRider({ ...rider, riderTransportation: value })}
                        items={[
                            { label: 'Walk', value: 'WALK' },
                            { label: 'Bicycle', value: 'BICYCLE' },
                            { label: 'Motorbike', value: 'MOTORBIKE' },
                            { label: 'Car', value: 'CAR' },
                        ]}
                        style={pickerStyles}
                        placeholder={{ label: '배달 수단 선택...', value: null }}
                        value={rider?.riderTransportation || null}
                    />
                    <TouchableOpacity onPress={handleSignup}>
                        <SpeechBubble
                            content="가입 완료"
                            backgroundColor="#ffffff"
                            textColor="#634F4F"
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    iconImage: {
        width: 60,
        height: 60,
        marginRight: 20,
    },
    logoImage: {
        width: 250,
    },
    infoBox: {
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    infoText: {
        fontSize: 20,
        color: '#4C241D',
        marginBottom: 10,
    },
    activityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    activityInput: {
        flex: 6, // 주소 입력 필드가 6 비율을 차지
        height: 40,
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    activityButton: {
        flex: 2, // 주소 확인 버튼이 2 비율을 차지
        marginLeft: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
    disabledInput: {
        backgroundColor: '#e0e0e0',
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
    inputAndroid: {
        height: 40,
        borderColor: '#634F4F',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
});

export default SignupScreen;
