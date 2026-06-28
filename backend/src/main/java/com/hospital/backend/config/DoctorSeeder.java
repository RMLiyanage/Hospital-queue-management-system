package com.hospital.backend.config;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DoctorSeeder {

    @Bean
    CommandLineRunner initDatabase(DoctorRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(Doctor.builder()
                        .doctorName("Dr. Silva")
                        .specialization("Cardiologist")
                        .build());
                repository.save(Doctor.builder()
                        .doctorName("Dr. Perera")
                        .specialization("Dentist")
                        .build());
                System.out.println("Preloaded doctor data into the database successfully.");
            }
        };
    }
}
