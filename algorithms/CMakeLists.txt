cmake_minimum_required(VERSION 3.14)
project(dsa-cli LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(dsa-cli cli.cpp)

target_include_directories(dsa-cli PRIVATE ${CMAKE_SOURCE_DIR})
