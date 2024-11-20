if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/sanjit/.gradle/caches/transforms-3/0d688140c973e9b88bdc09376f98160f/transformed/jetified-hermes-android-0.72.3-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/sanjit/.gradle/caches/transforms-3/0d688140c973e9b88bdc09376f98160f/transformed/jetified-hermes-android-0.72.3-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

